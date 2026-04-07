import type { DatabaseClient } from '../../db/client.js';
import { listTaskRecords, type ListTasksFilters } from './taskReadRepository.js';

export async function listTasks(
  db: DatabaseClient['db'],
  filters: ListTasksFilters,
) {
  return listTaskRecords(db, filters);
}
