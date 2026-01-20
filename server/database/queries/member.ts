import database from '../connection.js';

export const fetchMember = async (email: string, workspaceId: string) => {
  const client = await database.connect();
  return client?.('member').where({ email, workspaceId }).first();
};

export const createMember = async (data: {
  email: string;
  workspaceId: string;
}) => {
  const client = await database.connect();

  await client?.('member').insert({
    email: data.email,
    workspaceId: data.workspaceId,
  });
};
