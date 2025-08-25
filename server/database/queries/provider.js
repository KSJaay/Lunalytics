import SQLite from '../sqlite/setup.js';

export const createProvider = async (data) => {
  await SQLite?.client('providers').insert(data);
};

export const updateProvider = async (provider, data) => {
  await SQLite?.client('providers').where({ provider }).update(data);
};

export const deleteProvider = async (provider) => {
  await SQLite?.client('providers').where({ provider }).delete();
};

export const fetchProvider = async (provider) => {
  const providerData = await SQLite?.client('providers')
    .where({ provider })
    .first();

  return providerData;
};

export const fetchProviders = async () => {
  const providers = await SQLite?.client('providers').select('*');

  return providers;
};
