import { and, desc, eq } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { tasks } from '../../db/schema/tasks.js';

export type ListTasksFilters = {
  status?: typeof tasks.$inferSelect.status;
  clientId?: string;
  workerId?: string;
};

export async function listTaskRecords(
  db: DatabaseClient['db'],
  filters: ListTasksFilters,
) {
  return db.query.tasks.findMany({
    where: (task, operators) => {
      const conditions = [];

      if (filters.status) {
        conditions.push(eq(task.status, filters.status));
      }

      if (filters.clientId) {
        conditions.push(eq(task.clientId, filters.clientId));
      }

      if (filters.workerId) {
        conditions.push(eq(task.workerId, filters.workerId));
      }

      if (conditions.length === 0) {
        return undefined;
      }

      return and(...conditions);
    },
    orderBy: [desc(tasks.createdAt)],
  });
}

export async function findTaskRecordById(
  db: DatabaseClient['db'],
  taskId: string,
) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });
}
