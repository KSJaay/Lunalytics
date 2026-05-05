import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import {
  createMember,
  fetchMember,
} from '../../../../server/database/queries/member.js';

useTestDatabase();

describe('server/database/queries/member', () => {
  describe('createMember', () => {
    it('inserts a member row', async () => {
      const owner = await seedUser();
      const ws = await seedWorkspace({ ownerId: owner.email });
      const newUser = await seedUser();

      await createMember({ email: newUser.email, workspaceId: ws.id });
      const row = await fetchMember(newUser.email, ws.id);
      expect(row.email).toBe(newUser.email);
      expect(row.workspaceId).toBe(ws.id);
    });
  });

  describe('fetchMember', () => {
    it('returns undefined when no membership exists', async () => {
      expect(
        await fetchMember('x@y.z', '00000000-0000-7000-8000-000000000000')
      ).toBeUndefined();
    });
  });
});
