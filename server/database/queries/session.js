import SQLite from '../sqlite/setup.js';
import { nanoid } from 'nanoid';

const getUniqueSessionId = async () => {
  let sessionId = nanoid(64);

  while (await userSessionExists(sessionId)) {
    sessionId = await getUniqueSessionId();
  }

  return sessionId;
};

export const createUserSession = async (email, device, data) => {
  const sessionId = await getUniqueSessionId();

  await SQLite.client('user_session').insert({
    email,
    sessionId,
    device,
    data,
    createdAt: new Date().toISOString(),
  });

  return sessionId;
};

export const userSessionExists = async (sessionId) => {
  return SQLite.client('user_session').where({ sessionId }).first();
};

export const deleteUserSession = async (sessionId) => {
  return SQLite.client('user_session').where({ sessionId }).del();
};
