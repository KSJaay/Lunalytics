import database from '../../../server/database/connection.js';
import { generateHash } from '../../../server/utils/hashPassword.js';
import { oldPermsToFlags } from '../../../shared/permissions/oldPermsToFlags.js';

let userCounter = 0;

export interface UserOverrides {
  email?: string;
  displayName?: string;
  password?: string;
  avatar?: string | null;
  isOwner?: boolean;
  isVerified?: boolean;
  sso?: boolean;
  permission?: number;
  settings?: Record<string, unknown>;
}

export const userFactory = (overrides: UserOverrides = {}) => {
  const i = ++userCounter;
  return {
    email: `user-${i}-${Date.now()}@test.local`,
    displayName: `Test User ${i}`,
    password: 'Password!123',
    avatar: null,
    isOwner: false,
    isVerified: true,
    sso: false,
    permission: oldPermsToFlags[1] ?? 0,
    settings: {},
    ...overrides,
  };
};

export const seedUser = async (overrides: UserOverrides = {}) => {
  const data = userFactory(overrides);
  const client = await database.connect();
  if (!client) throw new Error('No DB connection');

  const row = {
    email: data.email.toLowerCase(),
    displayName: data.displayName,
    password: data.password ? generateHash(data.password) : null,
    avatar: data.avatar,
    isOwner: data.isOwner ? 1 : 0,
    isVerified: data.isVerified ? 1 : 0,
    sso: data.sso ? 1 : 0,
    permission: data.permission,
    created_at: new Date().toISOString(),
    settings: JSON.stringify(data.settings ?? {}),
  };

  await client('user').insert(row);
  return { ...row, _plaintextPassword: data.password };
};
