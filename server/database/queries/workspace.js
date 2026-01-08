import database from '../connection.js';
import randomId from '../../utils/randomId.js';

export const createWorkspace = async (name, icon, ownerId) => {
  const client = await database.connect();

  const data = await client('workspace')
    .insert({ id: randomId(), name, icon, ownerId })
    .returning('*');

  return data[0];
};

export const fetchWorkspace = async () => {
  const client = await database.connect();
  return client('workspace').first();
};

export const fetchDefaultWorkspace = async () => {
  const client = await database.connect();
  return client('workspace').first();
};
