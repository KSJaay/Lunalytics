import database from '../connection.js';
import randomId from '../../utils/randomId.js';

export const createWorkspace = async (
  name: string,
  icon: string,
  ownerId: string
) => {
  const client = await database.connect();

  const data = await client?.('workspace')
    .insert({ id: randomId(), name, icon, ownerId })
    .returning('*');

  return data?.[0];
};

export const fetchWorkspace = async (workspaceId: string) => {
  const client = await database.connect();
  return client?.('workspace').where({ id: workspaceId }).first();
};

export const fetchWorkspaceMembers = async (
  memberHasManageTeam: boolean = false,
  workspaceId: string
) => {
  const client = await database.connect();

  if (memberHasManageTeam) {
    return client?.('member')
      .where({ workspaceId })
      .select('email', 'permission', 'created_at');
  }

  return client?.('member')
    .where({ workspaceId, isVerified: true })
    .select('email', 'permission', 'created_at');
};
