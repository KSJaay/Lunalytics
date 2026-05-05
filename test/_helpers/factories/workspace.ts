import { v7 as uuidv7 } from 'uuid';

import database from '../../../server/database/connection.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

let counter = 0;

export interface WorkspaceOverrides {
  id?: string;
  name?: string;
  ownerId: string;
  icon?: string | null;
  memberCount?: number;
}

export const workspaceFactory = (overrides: WorkspaceOverrides) => {
  const i = ++counter;
  return {
    id: overrides.id ?? uuidv7(),
    name: overrides.name ?? `Workspace ${i}`,
    ownerId: overrides.ownerId,
    icon: overrides.icon ?? null,
    memberCount: overrides.memberCount ?? 1,
  };
};

export const seedWorkspace = async (overrides: WorkspaceOverrides) => {
  const data = workspaceFactory(overrides);
  const client = await database.connect();
  if (!client) throw new Error('No DB connection');

  await client('workspace').insert(data);

  await client('member').insert({
    email: data.ownerId,
    workspaceId: data.id,
    permission: MemberPermissionBits.ADMINISTRATOR,
  });

  return data;
};

export const seedMember = async (
  email: string,
  workspaceId: string,
  permission: number = MemberPermissionBits.VIEW_MONITORS
) => {
  const client = await database.connect();
  if (!client) throw new Error('No DB connection');

  await client('member').insert({ email, workspaceId, permission });
  return { email, workspaceId, permission };
};
