import database from '../connection.js';

export const createConnection = async (email: string, data: any) => {
  const client = await database.connect();

  await client?.('connections').insert({ email, ...data });
};

export const deleteConnection = async (email: string, provider: string) => {
  const client = await database.connect();
  await client?.('connections').where({ email, provider }).delete();
};

export const fetchConnections = async (email: string) => {
  const client = await database.connect();
  const connections = await client?.('connections')
    .where({ email })
    .select('*');

  return connections;
};

export const fetchConnectionByEmail = async (
  provider: string,
  accountId: string
) => {
  const client = await database.connect();

  const connection = await client?.('connections')
    .where({ provider, accountId })
    .select('*')
    .first();

  return connection;
};
