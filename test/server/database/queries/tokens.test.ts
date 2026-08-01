import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import { issueApiToken } from '../../../_helpers/auth.js';
import {
  apiTokenCreate,
  apiTokenDelete,
  apiTokenExists,
  apiTokenUpdate,
  getAllApiTokens,
} from '../../../../server/database/queries/tokens.js';

useTestDatabase();

describe('server/database/queries/tokens', () => {
  describe('apiTokenCreate', () => {
    it('inserts a token and returns the row', async () => {
      const u = await seedUser();
      const ws = await seedWorkspace({ ownerId: u.email });
      const row = await apiTokenCreate(u.email, 1, 'mytoken', ws.id);
      expect(row?.token).toBeDefined();
      expect(row?.token.length).toBe(92);
      expect(row?.name).toBe('mytoken');
    });

    it('falls back to a generated animal name when none is provided', async () => {
      const u = await seedUser();
      const ws = await seedWorkspace({ ownerId: u.email });
      const row = await apiTokenCreate(u.email, 1, '', ws.id);
      expect(row?.name).toBeTruthy();
      expect(row?.name.length).toBeGreaterThan(0);
    });
  });

  describe('apiTokenExists', () => {
    it('returns the row for an existing token', async () => {
      const u = await seedUser();
      const ws = await seedWorkspace({ ownerId: u.email });
      const token = await issueApiToken(u.email, ws.id);

      const row = await apiTokenExists(token);
      expect(row?.email).toBe(u.email);
    });

    it('returns undefined for an unknown token', async () => {
      expect(await apiTokenExists('nope')).toBeUndefined();
    });
  });

  describe('apiTokenUpdate', () => {
    it('updates the name and permission', async () => {
      const u = await seedUser();
      const ws = await seedWorkspace({ ownerId: u.email });
      const token = await issueApiToken(u.email, ws.id);

      const updated = await apiTokenUpdate(token, 'renamed', 99, ws.id);
      expect(updated?.name).toBe('renamed');
      expect(parseFloat(String(updated?.permission))).toBe(99);
    });
  });

  describe('apiTokenDelete', () => {
    it('removes the row and returns affected count', async () => {
      const u = await seedUser();
      const ws = await seedWorkspace({ ownerId: u.email });
      const token = await issueApiToken(u.email, ws.id);

      const deleted = await apiTokenDelete(token, ws.id);
      expect(deleted).toBe(1);
      expect(await apiTokenExists(token)).toBeUndefined();
    });
  });

  describe('getAllApiTokens', () => {
    it('returns only tokens for the requested workspace', async () => {
      const u = await seedUser();
      const ws1 = await seedWorkspace({ ownerId: u.email });
      const ws2 = await seedWorkspace({ ownerId: u.email });

      await issueApiToken(u.email, ws1.id);
      await issueApiToken(u.email, ws1.id);
      await issueApiToken(u.email, ws2.id);

      expect(await getAllApiTokens(ws1.id)).toHaveLength(2);
      expect(await getAllApiTokens(ws2.id)).toHaveLength(1);
    });
  });
});
