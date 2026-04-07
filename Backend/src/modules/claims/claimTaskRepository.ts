import { and, eq, isNull } from 'drizzle-orm';
import type { DatabaseClient } from '../../db/client.js';
import { withUpdatedAt } from '../../db/withUpdatedAt.js';
import { tasks } from '../../db/schema/tasks.js';
import { TASK_CLAIMABLE_STATUS, TASK_CLAIMED_STATUS } from '../../lib/taskStateMachine.js';

export async function claimOpenTaskRecord(
  db: DatabaseClient['db'],
  taskId: string,
  workerId: string,
) {
  const [claimedTask] = await db
    .update(tasks)
    .set(
      withUpdatedAt({
        workerId,
        status: TASK_CLAIMED_STATUS,
      }),
    )
    .where(
      and(
        eq(tasks.id, taskId),
        eq(tasks.status, TASK_CLAIMABLE_STATUS),
        isNull(tasks.workerId),
      ),
    )
    .returning();

  return claimedTask ?? null;
}
