import { nanoid } from 'nanoid';

import database from '../../server/database/connection.js';
import {
  SESSION_TOKEN,
  WORKSPACE_ID_COOKIE,
} from '../../shared/constants/cookies.js';
import { seedUser, type UserOverrides } from './factories/user.js';
import { seedWorkspace } from './factories/workspace.js';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';

export interface AuthenticatedContext {
  user: Awaited<ReturnType<typeof seedUser>>;
  workspace: { id: string; name: string };
  sessionToken: string;
  cookieHeader: string;
}

export const authenticate = async (
  userOverrides: UserOverrides = {},
  memberPermission: number = MemberPermissionBits.ADMINISTRATOR |
    MemberPermissionBits.VIEW_MONITORS |
    MemberPermissionBits.MANAGE_MONITORS
): Promise<AuthenticatedContext> => {
  const user = await seedUser(userOverrides);
  const workspace = await seedWorkspace({ ownerId: user.email });

  const client = await database.connect();
  if (!client) throw new Error('No DB connection');

  await client('member')
    .where({ email: user.email, workspaceId: workspace.id })
    .update({ permission: memberPermission });

  const sessionToken = nanoid(92);
  await client('user_session').insert({
    email: user.email,
    sessionId: sessionToken,
    device: 'test',
    data: null,
    created_at: new Date().toISOString(),
  });

  const cookieHeader = [
    `${SESSION_TOKEN}=${sessionToken}`,
    `${WORKSPACE_ID_COOKIE}=${workspace.id}`,
  ].join('; ');

  return { user, workspace, sessionToken, cookieHeader };
};

export const issueApiToken = async (
  email: string,
  workspaceId: string,
  permission: number = MemberPermissionBits.VIEW_MONITORS
): Promise<string> => {
  const token = nanoid(92);
  const client = await database.connect();
  if (!client) throw new Error('No DB connection');

  await client('api_token').insert({
    token,
    workspaceId,
    name: 'test-token',
    permission: String(permission),
    email,
    created_at: new Date().toISOString(),
  });

  return token;
};
