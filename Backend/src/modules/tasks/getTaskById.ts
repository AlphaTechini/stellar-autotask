import type { DatabaseClient } from '../../db/client.js';
import { findTaskRecordById } from './taskReadRepository.js';

export async function getTaskById(
  db: DatabaseClient['db'],
  taskId: string,
) {
  return findTaskRecordById(db, taskId);
}
