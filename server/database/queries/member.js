import database from '../connection.js';

export const fetchMember = async (email, workspaceId) => {
  const client = await database.connect();
  return client('member').where({ email, workspaceId }).first();
};

export const createMember = async (data) => {
  const client = await database.connect();

  await client('member').insert({
    email: data.email,
    workspaceId: data.workspaceId,
  });
};
