import { nanoid } from 'nanoid';
import { timeToMs } from '../../../shared/utils/ms.js';
import SQLite from '../sqlite/setup.js';

const getUniqueToken = async () => {
  let token = nanoid(8);

  while (await SQLite.client('invite').where({ token }).first()) {
    token = nanoid(8);
  }

  return token;
};

const getExpiryDate = (expiry) => {
  const [duration, type] = expiry.split(' ');

  if (!duration || !type) return null;

  const time = timeToMs(parseInt(duration), type);

  if (!time) return null;

  return new Date(Date.now() + time).toISOString();
};

export const fetchInviteUsingId = async (token) => {
  const invite = await SQLite.client('invite').where({ token }).first();

  return invite;
};

export const fetchAllInvites = async () => {
  const invites = await SQLite.client('invite').select();

  return invites;
};

export const createInvite = async (email, expiry, limit, permission) => {
  const token = await getUniqueToken();

  const expiresAt = !expiry ? null : getExpiryDate(expiry);

  const invite = {
    email,
    token,
    permission,
    paused: false,
    createdAt: new Date().toISOString(),
    expiresAt,
    limit: limit ? parseInt(limit) : null,
  };

  await SQLite.client('invite').insert(invite);

  return invite;
};

export const pauseInvite = async (token, paused) => {
  await SQLite.client('invite').where({ token }).update({ paused });

  return true;
};

export const deleteInvite = async (token) => {
  return SQLite.client('invite').where({ token }).del();
};
