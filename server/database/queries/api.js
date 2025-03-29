import SQLite from '../sqlite/setup.js';
import { nanoid } from 'nanoid';

export const apiTokenExists = async (token) => {
  return SQLite.client('api_token').where({ token }).first();
};

const getUniqueToken = async () => {
  let token = nanoid(64);

  while (await SQLite.client('api_token').where({ token }).first()) {
    token = nanoid(64);
  }

  return token;
};

export const apiTokenCreate = async (email, permission) => {
  const token = await getUniqueToken();

  await SQLite.client('api_token').insert({
    token,
    permission,
    email,
    createdAt: new Date().toISOString(),
  });
};
