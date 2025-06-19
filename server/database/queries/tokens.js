import { nanoid } from 'nanoid';
import SQLite from '../sqlite/setup.js';
import { generateRandomAnimalName } from '../../../shared/utils/animal.js';

export const apiTokenExists = async (token) => {
  console.log('token', token);

  return SQLite.client('api_token').where({ token }).first();
};

const getUniqueToken = async () => {
  let token = nanoid(64);

  while (await SQLite.client('api_token').where({ token }).first()) {
    token = nanoid(64);
  }

  return token;
};

export const getAllApiTokens = async () => {
  return SQLite.client('api_token').select();
};

export const apiTokenCreate = async (email, permission, name) => {
  const token = await getUniqueToken();

  const query = await SQLite.client('api_token')
    .insert({
      token,
      name: name || generateRandomAnimalName(),
      permission,
      email,
      createdAt: new Date().toISOString(),
    })
    .returning('*');

  return query[0];
};

export const apiTokenUpdate = async (token, name, permission) => {
  const query = await SQLite.client('api_token')
    .where({ token })
    .update({
      name: name || generateRandomAnimalName(),
      permission,
    })
    .returning('*');

  return query[0];
};

export const apiTokenDelete = async (token) => {
  return SQLite.client('api_token').where({ token }).delete();
};
