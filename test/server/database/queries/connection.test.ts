import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import {
  createConnection,
  deleteConnection,
  fetchConnectionByEmail,
  fetchConnections,
} from '../../../../server/database/queries/connection.js';

useTestDatabase();

describe('server/database/queries/connection', () => {
  describe('createConnection', () => {
    it('inserts a row with the provided email and data', async () => {
      const u = await seedUser();
      await createConnection(u.email, {
        provider: 'github',
        accountId: 'gh-1',
        created_at: new Date().toISOString(),
      });

      const rows = await fetchConnections(u.email);
      expect(rows).toHaveLength(1);
      expect(rows![0].provider).toBe('github');
      expect(rows![0].accountId).toBe('gh-1');
    });
  });

  describe('fetchConnections', () => {
    it('returns an empty array when no connections exist', async () => {
      const u = await seedUser();
      expect(await fetchConnections(u.email)).toEqual([]);
    });
  });

  describe('fetchConnectionByEmail', () => {
    it('looks up by provider+accountId', async () => {
      const u = await seedUser();
      await createConnection(u.email, {
        provider: 'github',
        accountId: 'gh-2',
        created_at: new Date().toISOString(),
      });

      const result = await fetchConnectionByEmail('github', 'gh-2');
      expect(result?.email).toBe(u.email);
    });

    it('returns undefined when not found', async () => {
      expect(await fetchConnectionByEmail('github', 'nope')).toBeUndefined();
    });
  });

  describe('deleteConnection', () => {
    it('removes the matching row', async () => {
      const u = await seedUser();
      await createConnection(u.email, {
        provider: 'github',
        accountId: 'gh-3',
        created_at: new Date().toISOString(),
      });

      await deleteConnection(u.email, 'github');
      expect(await fetchConnections(u.email)).toEqual([]);
    });
  });
});
