type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  agentToken?: string | null;
};

type AgentApiErrorPayload = {
  ok?: false;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
};

export class BackendApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, status: number, code = 'BACKEND_REQUEST_FAILED') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function createBackendApi(baseUrl: string) {
  async function request<T>(path: string, options: RequestOptions = {}) {
    const headers = new Headers();

    if (options.body !== undefined) {
      headers.set('content-type', 'application/json');
    }

    if (options.agentToken) {
      headers.set('authorization', `Bearer ${options.agentToken}`);
    }

    const response = await fetch(new URL(path, baseUrl), {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      let message = `Backend request failed with status ${response.status}.`;
      let code = 'BACKEND_REQUEST_FAILED';

      try {
        const payload = (await response.json()) as AgentApiErrorPayload;
        message = payload.error?.message ?? payload.message ?? message;
        code = payload.error?.code ?? code;
      } catch {
        // Keep the fallback when the backend returns no JSON body.
      }

      throw new BackendApiError(message, response.status, code);
    }

    return (await response.json()) as T;
  }

  return {
    getInfo() {
      return request<{
        ok: true;
        platform: {
          platformFundingWallet: string;
          stellarHorizonUrl: string;
          stellarNetworkPassphrase: string;
          authHomeDomain: string;
        };
      }>('/agent/info');
    },
    requestAgentChallenge(walletAddress: string) {
      return request<{
        ok: true;
        challenge: {
          transactionXdr: string;
          networkPassphrase: string;
          expiresAt: string;
          walletAddress: string;
        };
      }>('/agent/auth/challenge', {
        method: 'POST',
        body: {
          walletAddress,
        },
      });
    },
    verifyAgentWallet(input: {
      transactionXdr: string;
      username: string;
      credentialLabel: string;
    }) {
      return request<{
        ok: true;
        token: string;
        user: {
          id: string;
          username: string;
          role: 'agent';
          walletAddress: string;
          authType: 'wallet_agent';
          createdAt: string;
          updatedAt: string;
        };
        credential: {
          id: string;
          label: string;
          createdAt: string;
        };
      }>('/agent/auth/verify', {
        method: 'POST',
        body: input,
      });
    },
    createTask(agentToken: string, body: unknown) {
      return request<{
        ok: true;
        task: Record<string, unknown>;
      }>('/agent/tasks', {
        method: 'POST',
        body,
        agentToken,
      });
    },
    listOpenTasks(agentToken: string) {
      return request<{
        ok: true;
        tasks: Array<Record<string, unknown>>;
      }>('/agent/tasks/open', {
        agentToken,
      });
    },
    getTaskStatus(agentToken: string, taskId: string) {
      return request<{
        ok: true;
        task: {
          id: string;
          payoutAmount: string;
          currencyAsset: string;
          status: string;
          allowedClaimantType: 'human' | 'agent' | 'both';
          clientId: string;
          workerId: string | null;
          [key: string]: unknown;
        };
        payoutStatus: Record<string, unknown>;
        agentEligibility: {
          canClaim: boolean;
          allowedClaimantType: 'human' | 'agent' | 'both';
          isTaskCreator: boolean;
          isAssignedWorker: boolean;
        };
      }>(`/agent/tasks/${taskId}/status`, {
        agentToken,
      });
    },
    getTaskReport(agentToken: string, taskId: string) {
      return request<{
        ok: true;
        task: Record<string, unknown>;
        submission: Record<string, unknown> | null;
        verificationReport: Record<string, unknown> | null;
        latestReviewDecision: Record<string, unknown> | null;
        payoutStatus: Record<string, unknown>;
      }>(`/agent/tasks/${taskId}/report`, {
        agentToken,
      });
    },
    fundTask(agentToken: string, taskId: string, body: unknown) {
      return request<{
        ok: true;
        task: Record<string, unknown>;
        funding: Record<string, unknown>;
      }>(`/agent/tasks/${taskId}/fund`, {
        method: 'POST',
        body,
        agentToken,
      });
    },
    claimTask(agentToken: string, taskId: string) {
      return request<{
        ok: true;
        task: Record<string, unknown>;
      }>(`/agent/tasks/${taskId}/claim`, {
        method: 'POST',
        agentToken,
      });
    },
    submitTaskWork(agentToken: string, taskId: string, body: unknown) {
      return request<{
        ok: true;
        task: Record<string, unknown>;
        submission: Record<string, unknown>;
        verificationReport: Record<string, unknown>;
      }>(`/agent/tasks/${taskId}/submit`, {
        method: 'POST',
        body,
        agentToken,
      });
    },
  };
}
