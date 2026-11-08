import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import database from '../../../../server/database/connection.js';
import {
  createWorkspace,
  fetchWorkspace,
  fetchWorkspaceMembers,
} from '../../../../server/database/queries/workspace.js';

useTestDatabase();

describe('server/database/queries/workspace', () => {
  describe('createWorkspace', () => {
    it('inserts a workspace and returns it', async () => {
      const owner = await seedUser();
      const ws = await createWorkspace('My WS', 'icon.svg', owner.email);
      expect(ws.id).toBeDefined();
      expect(ws.name).toBe('My WS');
      expect(ws.ownerId).toBe(owner.email);
    });
  });

  describe('fetchWorkspace', () => {
    it('returns the workspace by id', async () => {
      const owner = await seedUser();
      const ws = await createWorkspace('X', null as any, owner.email);
      const fetched = await fetchWorkspace(ws.id);
      expect(fetched.id).toBe(ws.id);
    });

    it('returns undefined for an unknown id', async () => {
      expect(
        await fetchWorkspace('00000000-0000-7000-8000-000000000000')
      ).toBeUndefined();
    });
  });

  describe('fetchWorkspaceMembers', () => {
    it('returns all members when memberHasManageTeam=true', async () => {
      const owner = await seedUser();
      const ws = await createWorkspace('X', null as any, owner.email);
      const client = await database.connect();
      await client!('member').insert({
        email: owner.email,
        workspaceId: ws.id,
        permission: 1,
      });

      const result = await fetchWorkspaceMembers(true, ws.id);
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ email: owner.email });
    });
  });
});
