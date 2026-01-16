import { nanoid } from 'nanoid';
import database from '../connection.js';
import { generateRandomAnimalName } from '../../../shared/utils/animal.js';

export const apiTokenExists = async (token) => {
  const client = await database.connect();

  return client('api_token').where({ token }).first();
};

export const getAllApiTokens = async (workspaceId) => {
  const client = await database.connect();

  return client('api_token').where({ workspaceId }).select();
};

export const apiTokenCreate = async (email, permission, name, workspaceId) => {
  const client = await database.connect();
  const token = nanoid(92);

  const query = await client('api_token')
    .insert({
      token,
      workspaceId,
      name: name || generateRandomAnimalName(),
      permission,
      email,
      created_at: new Date().toISOString(),
    })
    .returning('*');

  return query[0];
};

export const apiTokenUpdate = async (token, name, permission, workspaceId) => {
  const client = await database.connect();

  const query = await client('api_token')
    .where({ token, workspaceId })
    .update({
      name: name || generateRandomAnimalName(),
      permission,
    })
    .returning('*');

  return query[0];
};

export const apiTokenDelete = async (token, workspaceId) => {
  const client = await database.connect();

  return client('api_token').where({ token, workspaceId }).delete();
};
