import type { DatabaseClient } from '../../db/client.js';
import { getAllowedClaimantTypesForAuthType } from '../../lib/claimantType.js';
import { listTasks } from '../tasks/listTasks.js';

export async function listOpenAgentTasks(
  db: DatabaseClient['db'],
  authType: string,
) {
  return listTasks(db, {
    status: 'OPEN',
    allowedClaimantTypes: getAllowedClaimantTypesForAuthType(authType),
  });
}
