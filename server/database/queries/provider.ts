import database from '../connection.js';

export const createProvider = async (data) => {
  const client = await database.connect();

  await client('providers').insert(data);
};

export const updateProvider = async (provider, data) => {
  const client = await database.connect();

  await client('providers').where({ provider }).update(data);
};

export const deleteProvider = async (provider) => {
  const client = await database.connect();

  await client('providers').where({ provider }).delete();
};

export const fetchProvider = async (provider) => {
  const client = await database.connect();

  const providerData = await client('providers').where({ provider }).first();

  if (!providerData) return null;

  return { ...providerData, data: JSON.parse(providerData?.data || '{}') };
};

export const fetchProviders = async () => {
  const client = await database.connect();

  const providers = await client('providers').select('*');

  return providers;
};
