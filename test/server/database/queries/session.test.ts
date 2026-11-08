import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import database from '../../../../server/database/connection.js';
import {
  cleanUserSessions,
  createUserSession,
  deleteUserSession,
  rotateUserSession,
  userSessionExists,
} from '../../../../server/database/queries/session.js';

useTestDatabase();

describe('server/database/queries/session', () => {
  describe('createUserSession', () => {
    it('inserts a row and returns the new sessionId', async () => {
      const user = await seedUser();
      const sessionId = await createUserSession(user.email, 'test-device', {
        foo: 'bar',
      });

      expect(sessionId).toHaveLength(92);

      const client = await database.connect();
      const row = await client!('user_session').where({ sessionId }).first();
      expect(row).toMatchObject({ email: user.email, device: 'test-device' });
    });
  });

  describe('userSessionExists', () => {
    it('returns the row when the session exists', async () => {
      const user = await seedUser();
      const sessionId = await createUserSession(user.email, 'd', null);
      const row = await userSessionExists(sessionId);
      expect(row?.email).toBe(user.email);
    });

    it('returns undefined for an unknown session', async () => {
      const row = await userSessionExists('nope');
      expect(row).toBeUndefined();
    });
  });

  describe('deleteUserSession', () => {
    it('removes the row and returns the affected count', async () => {
      const user = await seedUser();
      const sessionId = await createUserSession(user.email, 'd', null);
      const deleted = await deleteUserSession(sessionId);
      expect(deleted).toBe(1);
      expect(await userSessionExists(sessionId)).toBeUndefined();
    });

    it('returns 0 when nothing matches', async () => {
      expect(await deleteUserSession('nope')).toBe(0);
    });
  });

  describe('rotateUserSession', () => {
    it('replaces the sessionId and refreshes created_at', async () => {
      const user = await seedUser();
      const oldId = await createUserSession(user.email, 'd', null);
      const oldRow = await userSessionExists(oldId);

      await new Promise((r) => setTimeout(r, 5));

      const newId = await rotateUserSession(oldId);
      expect(newId).toHaveLength(92);
      expect(newId).not.toBe(oldId);

      expect(await userSessionExists(oldId)).toBeUndefined();

      const newRow = await userSessionExists(newId);
      expect(newRow?.email).toBe(user.email);
      expect(new Date(newRow!.created_at).getTime()).toBeGreaterThanOrEqual(
        new Date(oldRow!.created_at).getTime()
      );
    });
  });

  describe('cleanUserSessions', () => {
    it('deletes sessions older than 30 days, keeps fresh ones', async () => {
      const user = await seedUser();

      const client = await database.connect();
      await client!('user_session').insert({
        email: user.email,
        sessionId: 'fresh',
        device: 'd',
        data: null,
        created_at: new Date().toISOString(),
      });
      await client!('user_session').insert({
        email: user.email,
        sessionId: 'stale',
        device: 'd',
        data: null,
        created_at: new Date(
          Date.now() - 31 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      const deleted = await cleanUserSessions();
      expect(deleted).toBe(1);

      expect(await userSessionExists('fresh')).toBeDefined();
      expect(await userSessionExists('stale')).toBeUndefined();
    });
  });
});
