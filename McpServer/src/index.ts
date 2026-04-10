import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createAgentSession } from './agentSession.js';
import { createBackendApi, BackendApiError } from './backendApi.js';
import { bootstrapSponsoredWallet } from './bootstrapSponsoredWallet.js';
import { loadEnv } from './env.js';
import { fundTaskOnStellar } from './fundTaskOnStellar.js';
import { signAgentChallenge } from './signAgentChallenge.js';

function jsonContent(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function requireWalletSecret(session: AgentSession) {
  const walletSecretKey = session.getWalletSecretKey();

  if (!walletSecretKey) {
    throw new Error(
      'No agent wallet secret key is loaded. Use stellar_autotask_bootstrap_wallet or configure AGENT_WALLET_SECRET_KEY.',
    );
  }

  return walletSecretKey;
}

function requireAgentToken(session: AgentSession) {
  const agentToken = session.getAgentToken();

  if (!agentToken) {
    throw new Error(
      'No agent token is loaded. Use stellar_autotask_issue_token or configure AGENT_TOKEN.',
    );
  }

  return agentToken;
}

type AgentSession = ReturnType<typeof createAgentSession>;

async function main() {
  const env = loadEnv();
  const session = createAgentSession(env);
  const backendApi = createBackendApi(env.BACKEND_BASE_URL);
  const server = new McpServer({
    name: env.MCP_SERVER_NAME,
    version: env.MCP_SERVER_VERSION,
  });

  server.tool(
    'stellar_autotask_wallet_info',
    'Show the active agent wallet, token state, and backend funding configuration.',
    {},
    async () => {
      let platform: unknown = null;

      try {
        platform = (await backendApi.getInfo()).platform;
      } catch (error) {
        platform = {
          reachable: false,
          error: error instanceof Error ? error.message : 'Unable to reach backend info route.',
        };
      }

      return jsonContent({
        session: session.summary(),
        backendBaseUrl: env.BACKEND_BASE_URL,
        sponsoredAgentAccountUrl: env.SPONSORED_AGENT_ACCOUNT_URL ?? null,
        platform,
      });
    },
  );

  server.tool(
    'stellar_autotask_bootstrap_wallet',
    'Create a new Stellar wallet through the sponsored agent account service and cache it in memory for this MCP session.',
    {},
    async () => {
      if (!env.SPONSORED_AGENT_ACCOUNT_URL) {
        throw new Error(
          'SPONSORED_AGENT_ACCOUNT_URL is not configured for this MCP server.',
        );
      }

      const wallet = await bootstrapSponsoredWallet({
        serviceUrl: env.SPONSORED_AGENT_ACCOUNT_URL,
      });

      session.setWalletSecretKey(wallet.secretKey);
      session.setAgentToken(null);

      return jsonContent({
        ok: true,
        wallet,
        warning:
          'Persist the returned secret key securely after this session. The MCP server only caches it in memory.',
      });
    },
  );

  server.tool(
    'stellar_autotask_issue_token',
    'Sign the backend wallet challenge with the loaded agent wallet and create a reusable agent credential token.',
    {
      username: z
        .string()
        .trim()
        .min(3)
        .max(32)
        .optional()
        .describe('Agent username. The backend appends .agents when needed.'),
      credentialLabel: z
        .string()
        .trim()
        .min(1)
        .max(80)
        .optional()
        .describe('Human-readable label for the issued agent credential.'),
    },
    async ({ username, credentialLabel }) => {
      const walletSecretKey = requireWalletSecret(session);
      const signedChallenge = signAgentChallenge;
      const walletAddress = session.getWalletAddress();

      if (!walletAddress) {
        throw new Error('Unable to derive a wallet address from the loaded secret key.');
      }

      const challenge = await backendApi.requestAgentChallenge(walletAddress);
      const signed = signedChallenge({
        transactionXdr: challenge.challenge.transactionXdr,
        networkPassphrase: challenge.challenge.networkPassphrase,
        walletSecretKey,
      });

      const resolvedUsername = username?.trim() || session.getAgentUsername();

      if (!resolvedUsername) {
        throw new Error(
          'No agent username is set. Pass username explicitly or configure AGENT_USERNAME.',
        );
      }

      const resolvedCredentialLabel =
        credentialLabel?.trim() || session.getAgentCredentialLabel();
      const verification = await backendApi.verifyAgentWallet({
        transactionXdr: signed.signedTransactionXdr,
        username: resolvedUsername,
        credentialLabel: resolvedCredentialLabel,
      });

      session.setAgentToken(verification.token);
      session.setAgentUsername(verification.user.username);
      session.setAgentCredentialLabel(resolvedCredentialLabel);

      return jsonContent({
        ok: true,
        user: verification.user,
        credential: verification.credential,
        tokenCachedInMemory: true,
        tokenPreview: `${verification.token.slice(0, 14)}...${verification.token.slice(-6)}`,
      });
    },
  );

  server.tool(
    'stellar_autotask_create_task',
    'Create a new writing task through the agent API.',
    {
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      brief: z.string().trim().min(1).max(100),
      requiredKeywords: z.array(z.string().trim()).default([]),
      targetAudience: z.string().trim().min(1),
      tone: z.string().trim().min(1),
      minWordCount: z.number().int().min(0),
      payoutAmount: z.string().trim().regex(/^\d+(\.\d{1,7})?$/),
      currencyAsset: z.literal('XLM').default('XLM'),
      reviewWindowHours: z.number().int().positive().default(24),
      allowedClaimantType: z.enum(['human', 'agent', 'both']).default('agent'),
    },
    async (input) => {
      const agentToken = requireAgentToken(session);
      const response = await backendApi.createTask(agentToken, input);

      return jsonContent(response);
    },
  );

  server.tool(
    'stellar_autotask_fund_task',
    'Send the native XLM funding payment from the loaded agent wallet and confirm the task through the backend.',
    {
      taskId: z.string().uuid(),
    },
    async ({ taskId }) => {
      const agentToken = requireAgentToken(session);
      const walletSecretKey = requireWalletSecret(session);
      const [platformInfo, taskStatus] = await Promise.all([
        backendApi.getInfo(),
        backendApi.getTaskStatus(agentToken, taskId),
      ]);

      if (taskStatus.task.currencyAsset !== 'XLM') {
        throw new Error('Only native XLM task funding is supported by this MCP server.');
      }

      const payment = await fundTaskOnStellar({
        walletSecretKey,
        amount: taskStatus.task.payoutAmount,
        destinationWallet: platformInfo.platform.platformFundingWallet,
        horizonUrl: platformInfo.platform.stellarHorizonUrl,
        networkPassphrase: platformInfo.platform.stellarNetworkPassphrase,
      });

      try {
        const confirmation = await backendApi.fundTask(agentToken, taskId, payment);

        return jsonContent({
          ok: true,
          payment,
          confirmation,
        });
      } catch (error) {
        if (error instanceof BackendApiError) {
          return jsonContent({
            ok: false,
            paymentSubmitted: true,
            payment,
            backendError: {
              code: error.code,
              message: error.message,
              status: error.status,
            },
            retryHint:
              'The on-chain payment was already submitted. Reuse the same txHash for backend confirmation instead of sending funds twice.',
          });
        }

        throw error;
      }
    },
  );

  server.tool(
    'stellar_autotask_list_open_tasks',
    'List currently open tasks visible to the authenticated agent.',
    {},
    async () => {
      const agentToken = requireAgentToken(session);
      const response = await backendApi.listOpenTasks(agentToken);

      return jsonContent(response);
    },
  );

  server.tool(
    'stellar_autotask_get_task_status',
    'Fetch the current task state, payout status, and agent eligibility for a single task.',
    {
      taskId: z.string().uuid(),
    },
    async ({ taskId }) => {
      const agentToken = requireAgentToken(session);
      const response = await backendApi.getTaskStatus(agentToken, taskId);

      return jsonContent(response);
    },
  );

  server.tool(
    'stellar_autotask_get_verification_report',
    'Fetch the persisted submission snapshot, verification report, review decision, and payout visibility for a task.',
    {
      taskId: z.string().uuid(),
    },
    async ({ taskId }) => {
      const agentToken = requireAgentToken(session);
      const response = await backendApi.getTaskReport(agentToken, taskId);

      return jsonContent(response);
    },
  );

  server.tool(
    'stellar_autotask_claim_task',
    'Claim an open task for the authenticated agent.',
    {
      taskId: z.string().uuid(),
    },
    async ({ taskId }) => {
      const agentToken = requireAgentToken(session);
      const response = await backendApi.claimTask(agentToken, taskId);

      return jsonContent(response);
    },
  );

  server.tool(
    'stellar_autotask_submit_task_work',
    'Submit writing work for a claimed task and trigger verification.',
    {
      taskId: z.string().uuid(),
      contentText: z.string().trim().min(1),
      notes: z.string().trim().min(1).optional(),
      documentUrl: z.string().trim().url().optional(),
    },
    async ({ taskId, ...body }) => {
      const agentToken = requireAgentToken(session);
      const response = await backendApi.submitTaskWork(agentToken, taskId, body);

      return jsonContent(response);
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(`${env.MCP_SERVER_NAME} running over stdio`);
  console.error(`backend: ${env.BACKEND_BASE_URL}`);
}

main().catch((error) => {
  console.error('Fatal MCP server startup error:', error);
  process.exit(1);
});
