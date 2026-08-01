import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import {
  createProvider,
  deleteProvider,
  fetchProvider,
  fetchProviders,
  updateProvider,
} from '../../../../server/database/queries/provider.js';

useTestDatabase();

describe('server/database/queries/provider', () => {
  describe('createProvider + fetchProvider', () => {
    it('inserts and parses JSON data', async () => {
      await createProvider({
        provider: 'github',
        clientId: 'id',
        clientSecret: 'secret',
        enabled: true,
        data: JSON.stringify({ scope: 'user:email' }),
      });

      const result = await fetchProvider('github');
      expect(result?.clientId).toBe('id');
      expect(result?.data).toEqual({ scope: 'user:email' });
    });

    it('returns null when provider does not exist', async () => {
      expect(await fetchProvider('nope')).toBeNull();
    });
  });

  describe('updateProvider', () => {
    it('updates the row', async () => {
      await createProvider({
        provider: 'github',
        clientId: 'id',
        clientSecret: 'secret',
        enabled: true,
        data: '{}',
      });
      await updateProvider('github', { clientId: 'changed' });
      const result = await fetchProvider('github');
      expect(result?.clientId).toBe('changed');
    });
  });

  describe('deleteProvider', () => {
    it('removes the row', async () => {
      await createProvider({
        provider: 'github',
        clientId: 'id',
        clientSecret: 'secret',
        enabled: true,
        data: '{}',
      });
      await deleteProvider('github');
      expect(await fetchProvider('github')).toBeNull();
    });
  });

  describe('fetchProviders', () => {
    it('returns all providers', async () => {
      await createProvider({
        provider: 'a',
        clientId: 'i',
        clientSecret: 's',
        enabled: true,
        data: '{}',
      });
      await createProvider({
        provider: 'b',
        clientId: 'i',
        clientSecret: 's',
        enabled: true,
        data: '{}',
      });
      const result = await fetchProviders();
      expect(result).toHaveLength(2);
    });
  });
});
