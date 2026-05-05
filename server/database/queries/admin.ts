import database from '../connection.js';

export const fetchApplicationUsers = async () => {
  const client = await database.connect();

  const users = await client?.('user').select(
    'displayName',
    'email',
    'avatar',
    'created_at'
  );

  return users || [];
};

export const fetchApplicationWorkspaces = async () => {
  const client = await database.connect();

  const workspaces = await client?.('workspace').select(
    'id',
    'name',
    'ownerId',
    'icon',
    'created_at',
    'memberCount'
  );

  return workspaces || [];
};
