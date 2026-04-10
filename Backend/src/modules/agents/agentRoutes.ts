import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { createWalletChallenge } from '../auth/createWalletChallenge.js';
import { verifyWalletChallenge } from '../auth/verifyWalletChallenge.js';
import { claimTask } from '../claims/claimTask.js';
import { confirmTaskFunding } from '../funding/confirmTaskFunding.js';
import { getTaskReviewSnapshot } from '../review/getTaskReviewSnapshot.js';
import { submitTask } from '../submissions/submitTask.js';
import { createTask } from '../tasks/createTask.js';
import { createAgentCredential } from './createAgentCredential.js';
import {
  agentCreateTaskRequestSchema,
  agentFundTaskParamsSchema,
  agentFundTaskRequestSchema,
  agentSubmitTaskParamsSchema,
  agentSubmitTaskRequestSchema,
  agentTaskStatusParamsSchema,
  agentWalletChallengeRequestSchema,
  agentWalletVerifyRequestSchema,
} from './agentAuthSchemas.js';
import { getAgentPlatformInfo } from './getAgentPlatformInfo.js';
import { getAgentTaskStatus } from './getAgentTaskStatus.js';
import { listOpenAgentTasks } from './listOpenAgentTasks.js';
import { upsertWalletAgentUser } from './upsertWalletAgentUser.js';

type AgentRequestUser = NonNullable<FastifyRequest['authUser']>;

function sendAgentError(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
) {
  return reply.code(statusCode).send({
    ok: false,
    error: {
      code,
      message,
    },
  });
}

function requireAgentAuth(request: FastifyRequest, reply: FastifyReply): AgentRequestUser | null {
  if (!request.authUser || request.authUser.authType !== 'wallet_agent' || request.authUser.role !== 'agent') {
    void sendAgentError(
      reply,
      401,
      'AGENT_AUTH_REQUIRED',
      'A wallet-backed agent credential is required for this route.',
    );
    return null;
  }

  return request.authUser;
}

const agentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/info', async (request, reply) => {
    return reply.send({
      ok: true,
      platform: getAgentPlatformInfo(fastify.env),
    });
  });

  fastify.post('/auth/challenge', async (request, reply) => {
    try {
      const input = agentWalletChallengeRequestSchema.parse(request.body);
      const challenge = createWalletChallenge(input.walletAddress, fastify.env);

      return reply.send({
        ok: true,
        challenge,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid request body.',
        );
      }

      return sendAgentError(
        reply,
        400,
        'CHALLENGE_FAILED',
        error instanceof Error ? error.message : 'Unable to create agent wallet challenge.',
      );
    }
  });

  fastify.post('/auth/verify', async (request, reply) => {
    try {
      const input = agentWalletVerifyRequestSchema.parse(request.body);
      const verifiedChallenge = verifyWalletChallenge(input.transactionXdr, fastify.env);
      const userWriteResult = await upsertWalletAgentUser(fastify.db, {
        walletAddress: verifiedChallenge.walletAddress,
        username: input.username,
      });

      if (userWriteResult.kind === 'auth_type_conflict') {
        return sendAgentError(
          reply,
          409,
          'AUTH_TYPE_CONFLICT',
          'This wallet is already bound to a non-agent authentication type.',
        );
      }

      const credentialResult = await createAgentCredential(fastify.db, {
        userId: userWriteResult.user.id,
        label: input.credentialLabel,
      });

      return reply.code(201).send({
        ok: true,
        token: credentialResult.rawToken,
        user: {
          id: userWriteResult.user.id,
          username: userWriteResult.user.username,
          role: userWriteResult.user.role,
          walletAddress: userWriteResult.user.stellarWalletAddress,
          authType: userWriteResult.user.authType,
          createdAt: userWriteResult.user.createdAt,
          updatedAt: userWriteResult.user.updatedAt,
        },
        credential: {
          id: credentialResult.credential.id,
          label: credentialResult.credential.label,
          createdAt: credentialResult.credential.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid request body.',
        );
      }

      return sendAgentError(
        reply,
        401,
        'VERIFY_FAILED',
        error instanceof Error ? error.message : 'Agent wallet challenge verification failed.',
      );
    }
  });

  fastify.post('/tasks', async (request, reply) => {
    const authUser = requireAgentAuth(request, reply);

    if (!authUser) {
      return reply;
    }

    try {
      const input = agentCreateTaskRequestSchema.parse(request.body);
      const task = await createTask(fastify.db, {
        clientId: authUser.userId,
        ...input,
      });

      return reply.code(201).send({
        ok: true,
        task,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid request body.',
        );
      }

      return sendAgentError(
        reply,
        400,
        'TASK_CREATE_FAILED',
        error instanceof Error ? error.message : 'Unable to create task.',
      );
    }
  });

  fastify.get('/tasks/open', async (request, reply) => {
    const authUser = requireAgentAuth(request, reply);

    if (!authUser) {
      return reply;
    }

    const tasks = await listOpenAgentTasks(fastify.db, authUser.authType);

    return reply.send({
      ok: true,
      tasks,
    });
  });

  fastify.get('/tasks/:id/status', async (request, reply) => {
    const authUser = requireAgentAuth(request, reply);

    if (!authUser) {
      return reply;
    }

    try {
      const params = agentTaskStatusParamsSchema.parse(request.params);
      const status = await getAgentTaskStatus(fastify.db, params.id, {
        userId: authUser.userId,
        authType: authUser.authType,
      });

      if (!status) {
        return sendAgentError(reply, 404, 'TASK_NOT_FOUND', 'Task not found.');
      }

      return reply.send({
        ok: true,
        ...status,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid route params.',
        );
      }

      return sendAgentError(
        reply,
        500,
        'TASK_STATUS_FAILED',
        error instanceof Error ? error.message : 'Unable to fetch task status.',
      );
    }
  });

  fastify.get('/tasks/:id/report', async (request, reply) => {
    const authUser = requireAgentAuth(request, reply);

    if (!authUser) {
      return reply;
    }

    try {
      const params = agentTaskStatusParamsSchema.parse(request.params);
      const snapshot = await getTaskReviewSnapshot(fastify.db, params.id);

      if (!snapshot) {
        return sendAgentError(reply, 404, 'TASK_NOT_FOUND', 'Task not found.');
      }

      return reply.send({
        ok: true,
        task: snapshot.task,
        submission: snapshot.submission,
        verificationReport: snapshot.verificationReport,
        latestReviewDecision: snapshot.latestReviewDecision,
        payoutStatus: snapshot.payoutStatus,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid route params.',
        );
      }

      return sendAgentError(
        reply,
        500,
        'TASK_REPORT_FAILED',
        error instanceof Error ? error.message : 'Unable to fetch task report.',
      );
    }
  });

  fastify.post('/tasks/:id/fund', async (request, reply) => {
    const authUser = requireAgentAuth(request, reply);

    if (!authUser) {
      return reply;
    }

    try {
      const params = agentFundTaskParamsSchema.parse(request.params);
      const input = agentFundTaskRequestSchema.parse(request.body);
      const result = await confirmTaskFunding(
        fastify.db,
        fastify.env,
        params.id,
        authUser.userId,
        authUser.walletAddress,
        {
          amount: input.amount.trim(),
          assetCode: input.assetCode,
          txHash: input.txHash.trim(),
          fromWalletAddress: input.fromWalletAddress.trim().toUpperCase(),
          toWalletAddress: input.toWalletAddress.trim().toUpperCase(),
        },
      );

      if (result.kind === 'not_found') {
        return sendAgentError(reply, 404, 'TASK_NOT_FOUND', 'Task not found.');
      }

      if (result.kind === 'forbidden') {
        return sendAgentError(
          reply,
          403,
          'TASK_FUND_FORBIDDEN',
          'Only the task creator can fund this task.',
        );
      }

      if (result.kind === 'already_funded') {
        return sendAgentError(
          reply,
          409,
          'TASK_ALREADY_FUNDED',
          'Task is already funded and claimable.',
        );
      }

      if (result.kind === 'not_fundable') {
        return sendAgentError(
          reply,
          409,
          'TASK_NOT_FUNDABLE',
          'Task is not in a fundable state.',
        );
      }

      if (result.kind === 'wallet_mismatch') {
        return sendAgentError(
          reply,
          400,
          'WALLET_MISMATCH',
          'Funding wallet must match the authenticated agent wallet.',
        );
      }

      if (result.kind === 'amount_mismatch') {
        return sendAgentError(
          reply,
          400,
          'AMOUNT_MISMATCH',
          'Funding amount must match the task payout amount.',
        );
      }

      if (result.kind === 'asset_mismatch') {
        return sendAgentError(
          reply,
          400,
          'ASSET_MISMATCH',
          'Funding asset must match the task currency asset.',
        );
      }

      if (result.kind === 'unsupported_asset') {
        return sendAgentError(
          reply,
          400,
          'UNSUPPORTED_ASSET',
          'This task is outside the current native XLM funding path.',
        );
      }

      if (result.kind === 'destination_mismatch') {
        return sendAgentError(
          reply,
          400,
          'DESTINATION_MISMATCH',
          'Funding destination must match the configured platform funding wallet.',
        );
      }

      if (result.kind === 'funding_conflict') {
        return sendAgentError(
          reply,
          409,
          'FUNDING_CONFLICT',
          'Task funding changed while this request was being processed.',
        );
      }

      return reply.send({
        ok: true,
        task: result.task,
        funding: result.funding,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid request.',
        );
      }

      return sendAgentError(
        reply,
        500,
        'TASK_FUND_FAILED',
        error instanceof Error ? error.message : 'Unable to fund task.',
      );
    }
  });

  fastify.post('/tasks/:id/claim', async (request, reply) => {
    const authUser = requireAgentAuth(request, reply);

    if (!authUser) {
      return reply;
    }

    try {
      const params = agentTaskStatusParamsSchema.parse(request.params);
      const result = await claimTask(
        fastify.db,
        params.id,
        authUser.userId,
        authUser.authType,
      );

      if (result.kind === 'not_found') {
        return sendAgentError(reply, 404, 'TASK_NOT_FOUND', 'Task not found.');
      }

      if (result.kind === 'self_claim_forbidden') {
        return sendAgentError(
          reply,
          403,
          'SELF_CLAIM_FORBIDDEN',
          'You cannot claim a task you created.',
        );
      }

      if (result.kind === 'claimant_type_forbidden') {
        return sendAgentError(
          reply,
          403,
          'CLAIMANT_TYPE_FORBIDDEN',
          'This task is not open to the current claimant type.',
        );
      }

      if (result.kind === 'not_claimable') {
        return sendAgentError(
          reply,
          409,
          result.reason === 'claimed' ? 'TASK_ALREADY_CLAIMED' : 'TASK_NOT_OPEN',
          result.reason === 'claimed'
            ? 'Task has already been claimed.'
            : 'Task is not open for claiming.',
        );
      }

      if (result.kind === 'claim_conflict') {
        return sendAgentError(
          reply,
          409,
          'CLAIM_CONFLICT',
          'Task was claimed by another actor just now.',
        );
      }

      return reply.send({
        ok: true,
        task: result.task,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid route params.',
        );
      }

      return sendAgentError(
        reply,
        500,
        'TASK_CLAIM_FAILED',
        error instanceof Error ? error.message : 'Unable to claim task.',
      );
    }
  });

  fastify.post('/tasks/:id/submit', async (request, reply) => {
    const authUser = requireAgentAuth(request, reply);

    if (!authUser) {
      return reply;
    }

    try {
      const params = agentSubmitTaskParamsSchema.parse(request.params);
      const input = agentSubmitTaskRequestSchema.parse(request.body);
      const result = await submitTask(fastify.db, params.id, authUser.userId, input);

      if (result.kind === 'not_found') {
        return sendAgentError(reply, 404, 'TASK_NOT_FOUND', 'Task not found.');
      }

      if (result.kind === 'forbidden') {
        return sendAgentError(
          reply,
          403,
          'TASK_SUBMIT_FORBIDDEN',
          'Only the assigned worker can submit this task.',
        );
      }

      if (result.kind === 'not_submittable') {
        return sendAgentError(
          reply,
          409,
          'TASK_NOT_SUBMITTABLE',
          'Task is not ready for submission.',
        );
      }

      if (result.kind === 'submission_conflict') {
        return sendAgentError(
          reply,
          409,
          'SUBMISSION_CONFLICT',
          'Task submission changed while this request was being processed.',
        );
      }

      return reply.send({
        ok: true,
        task: result.task,
        submission: result.submission,
        verificationReport: result.verificationReport,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return sendAgentError(
          reply,
          400,
          'INVALID_REQUEST',
          error.issues[0]?.message ?? 'Invalid request.',
        );
      }

      return sendAgentError(
        reply,
        500,
        'TASK_SUBMIT_FAILED',
        error instanceof Error ? error.message : 'Unable to submit task.',
      );
    }
  });
};

export default agentRoutes;
