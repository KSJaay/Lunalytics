import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import {
  fetchApplicationUsers,
  fetchApplicationWorkspaces,
} from '../../../../server/database/queries/admin.js';

useTestDatabase();

describe('server/database/queries/admin', () => {
  describe('fetchApplicationUsers', () => {
    it('returns an empty list when no users exist', async () => {
      expect(await fetchApplicationUsers()).toEqual([]);
    });

    it('returns users with safe fields only (no password/permission)', async () => {
      await seedUser({ email: 'a@x', displayName: 'A' });
      await seedUser({ email: 'b@x', displayName: 'B' });
      const users = await fetchApplicationUsers();
      expect(users).toHaveLength(2);
      for (const u of users) {
        expect(Object.keys(u).sort()).toEqual([
          'avatar',
          'created_at',
          'displayName',
          'email',
        ]);
      }
    });
  });

  describe('fetchApplicationWorkspaces', () => {
    it('returns workspaces with required public fields', async () => {
      const owner = await seedUser();
      const ws = await seedWorkspace({ ownerId: owner.email });
      const result = await fetchApplicationWorkspaces();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(ws.id);
      expect(result[0].ownerId).toBe(owner.email);
    });
  });
});
