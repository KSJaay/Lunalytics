// import type definitions
import { Knex } from 'knex';

// import node modules
import { customAlphabet } from 'nanoid';

// import local files
import { timeToMs, TimeType } from '../../../shared/utils/ms.js';
import database from '../connection.js';

const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  12
);

const getUniqueToken = async (client?: Knex) => {
  let token = nanoid(12);

  while (await client?.('invite').where({ token }).first()) {
    token = nanoid(12);
  }

  return token;
};

const getExpiryDate = (expiry: string) => {
  const [duration, type] = expiry.split(' ');

  if (!duration || !type) return null;

  const time = timeToMs(parseInt(duration), type as TimeType);

  if (!time) return null;

  return new Date(Date.now() + time).toISOString();
};

export const fetchInviteUsingId = async (token: string) => {
  const client = await database.connect();
  const invite = await client?.('invite').where({ token }).first();

  return invite;
};

export const fetchAllInvites = async (workspaceId: string) => {
  const client = await database.connect();
  const invites = await client?.('invite').where({ workspaceId }).select();

  return invites;
};

export const createInvite = async (
  email: string,
  expiry: string,
  limit: string,
  permission: number,
  workspaceId: string
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

  await client?.('invite').insert(invite);

  return invite;
};

export const pauseInvite = async (token: string, paused: boolean) => {
  const client = await database.connect();
  await client?.('invite').where({ token }).update({ paused });

  return true;
};

export const deleteInvite = async (token: string) => {
  const client = await database.connect();
  return client?.('invite').where({ token }).del();
};

export const increaseInviteUses = async (token: string) => {
  const client = await database.connect();
  const invite = await client?.('invite').where({ token }).first();
  const newUses = invite.uses ? invite.uses + 1 : 1;

  if (invite.limit && newUses >= invite.limit) {
    await deleteInvite(token);
    return true;
  }

  await client?.('invite').where({ token }).update({ uses: newUses });
  return false;
};
