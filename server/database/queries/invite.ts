import { customAlphabet } from 'nanoid';
import { timeToMs } from '../../../shared/utils/ms.js';
import database from '../connection.js';

const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  12
);

const getUniqueToken = async (client) => {
  let token = nanoid(12);

  while (await client('invite').where({ token }).first()) {
    token = nanoid(12);
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
  const client = await database.connect();
  const invite = await client('invite').where({ token }).first();

  return invite;
};

export const fetchAllInvites = async (workspaceId) => {
  const client = await database.connect();
  const invites = await client('invite').where({ workspaceId }).select();

  return invites;
};

export const createInvite = async (
  email,
  expiry,
  limit,
  permission,
  workspaceId
) => {
  const client = await database.connect();
  const token = await getUniqueToken(client);

  const expiresAt = !expiry ? null : getExpiryDate(expiry);

  const invite = {
    email,
    token,
    permission,
    paused: false,
    created_at: new Date().toISOString(),
    expiresAt,
    limit: limit ? parseInt(limit) : null,
    uses: 0,
    workspaceId,
  };

  await client('invite').insert(invite);

  return invite;
};

export const pauseInvite = async (token, paused) => {
  const client = await database.connect();
  await client('invite').where({ token }).update({ paused });

  return true;
};

export const deleteInvite = async (token) => {
  const client = await database.connect();
  return client('invite').where({ token }).del();
};

export const increaseInviteUses = async (token) => {
  const client = await database.connect();
  const invite = await client('invite').where({ token }).first();
  const newUses = invite.uses ? invite.uses + 1 : 1;

  if (invite.limit && newUses >= invite.limit) {
    await deleteInvite(token);
    return true;
  }

  await client('invite').where({ token }).update({ uses: newUses });
  return false;
};
