import SQLite from '../sqlite/setup.js';

export const createConnection = async (email, data) => {
  await SQLite.client('connections').insert({ email, ...data });
};

export const deleteConnection = async (email, provider) => {
  await SQLite.client('connections').where({ email, provider }).delete();
};

export const fetchConnections = async (email) => {
  const connections = await SQLite.client('connections')
    .where({ email })
    .select('*');

  return connections;
};
