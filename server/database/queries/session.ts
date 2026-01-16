import { timeToMs } from '../../../shared/utils/ms.js';
import database from '../connection.js';
import { nanoid } from 'nanoid';

export const createUserSession = async (email, device, data) => {
  const sessionId = nanoid(92);

  const client = await database.connect();

  await client('user_session').insert({
    email,
    sessionId,
    device,
    data,
    created_at: new Date().toISOString(),
  });

  return sessionId;
};

export const userSessionExists = async (sessionId) => {
  const client = await database.connect();

  return client('user_session').where({ sessionId }).first();
};

export const deleteUserSession = async (sessionId) => {
  const client = await database.connect();

  return client('user_session').where({ sessionId }).del();
};

export const cleanUserSessions = async () => {
  const client = await database.connect();

  const retentionMs = timeToMs(60, 'days');
  const date = new Date(Date.now() - retentionMs).toISOString();

  return client('user_session').where('created_at', '<', date).del();
};
