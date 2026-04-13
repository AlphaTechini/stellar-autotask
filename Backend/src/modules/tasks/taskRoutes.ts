import type { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { createTask } from './createTask.js';
import { getTaskById } from './getTaskById.js';
import { CLAIMED_TASK_STATUSES, listClaimedTaskSnapshots } from './listClaimedTaskSnapshots.js';
import { listTasks } from './listTasks.js';
import {
	claimedTasksQuerySchema,
	createTaskRequestSchema,
	listTasksQuerySchema,
	taskParamsSchema,
} from './taskSchemas.js';

const taskRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', async (request, reply) => {
    if (!request.authUser) {
      throw fastify.httpErrors.unauthorized('Authentication is required to create a task.');
    }

    try {
      const input = createTaskRequestSchema.parse(request.body);
      const createdTask = await createTask(fastify.db, {
        clientId: request.authUser.userId,
        ...input,
      });

      return reply.code(201).send({
        task: createdTask,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid request body.');
      }

      throw fastify.httpErrors.badRequest(
        error instanceof Error ? error.message : 'Unable to create task.',
      );
    }
  });

  fastify.get('/', async (request) => {
    try {
      const query = listTasksQuerySchema.parse(request.query);
      const taskList = await listTasks(fastify.db, query);

      return {
        tasks: taskList,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid query string.');
      }

      throw error;
    }
  });

  fastify.get('/claimed', async (request) => {
    if (!request.authUser) {
      throw fastify.httpErrors.unauthorized(
        'Authentication is required to view claimed tasks.',
      );
    }

    try {
      const query = claimedTasksQuerySchema.parse(request.query);
      const statuses = query.status ? [query.status] : [...CLAIMED_TASK_STATUSES];
      const tasks = await listClaimedTaskSnapshots(fastify.db, statuses);

      return {
        tasks,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(
          error.issues[0]?.message ?? 'Invalid query string.',
        );
      }

      throw error;
    }
  });

  fastify.get('/:id', async (request) => {
    try {
      const params = taskParamsSchema.parse(request.params);
      const task = await getTaskById(fastify.db, params.id);

      if (!task) {
        throw fastify.httpErrors.notFound('Task not found.');
      }

      return {
        task,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw fastify.httpErrors.badRequest(error.issues[0]?.message ?? 'Invalid route params.');
      }

      throw error;
    }
  });
};

export default taskRoutes;
