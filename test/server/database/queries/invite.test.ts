import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import {
  createInvite,
  deleteInvite,
  fetchAllInvites,
  fetchInviteUsingId,
  increaseInviteUses,
  pauseInvite,
} from '../../../../server/database/queries/invite.js';

useTestDatabase();

const setup = async () => {
  const u = await seedUser();
  const ws = await seedWorkspace({ ownerId: u.email });
  return { u, ws };
};

describe('server/database/queries/invite', () => {
  describe('createInvite', () => {
    it('creates an invite with a unique 12-char token', async () => {
      const { u, ws } = await setup();
      const invite = await createInvite(u.email, '1 days', '5', 0, ws.id);
      expect(invite.token).toHaveLength(12);
      expect(invite.uses).toBe(0);
      expect(invite.limit).toBe(5);
      expect(invite.expiresAt).toBeDefined();
    });

    it('accepts a null expiry', async () => {
      const { u, ws } = await setup();
      const invite = await createInvite(u.email, '', '', 0, ws.id);
      expect(invite.expiresAt).toBeNull();
      expect(invite.limit).toBeNull();
    });
  });

  describe('fetchInviteUsingId', () => {
    it('returns the invite', async () => {
      const { u, ws } = await setup();
      const invite = await createInvite(u.email, '', '', 0, ws.id);
      const found = await fetchInviteUsingId(invite.token);
      expect(found?.email).toBe(u.email);
    });

    it('returns undefined when not found', async () => {
      expect(await fetchInviteUsingId('nope')).toBeUndefined();
    });
  });

  describe('fetchAllInvites', () => {
    it('returns all invites for the workspace', async () => {
      const { u, ws } = await setup();
      await createInvite(u.email, '', '', 0, ws.id);
      await createInvite(u.email, '', '', 0, ws.id);
      expect(await fetchAllInvites(ws.id)).toHaveLength(2);
    });
  });

  describe('pauseInvite', () => {
    it('flips the paused flag', async () => {
      const { u, ws } = await setup();
      const invite = await createInvite(u.email, '', '', 0, ws.id);
      await pauseInvite(invite.token, true);
      const row = await fetchInviteUsingId(invite.token);
      expect(row?.paused).toBeTruthy();
    });
  });

  describe('deleteInvite', () => {
    it('removes the invite', async () => {
      const { u, ws } = await setup();
      const invite = await createInvite(u.email, '', '', 0, ws.id);
      const deleted = await deleteInvite(invite.token);
      expect(deleted).toBe(1);
    });
  });

  describe('increaseInviteUses', () => {
    it('increments uses when below limit', async () => {
      const { u, ws } = await setup();
      const invite = await createInvite(u.email, '', '5', 0, ws.id);
      const reachedLimit = await increaseInviteUses(invite.token);
      expect(reachedLimit).toBe(false);
      const row = await fetchInviteUsingId(invite.token);
      expect(row?.uses).toBe(1);
    });

    it('deletes the invite when the limit is reached', async () => {
      const { u, ws } = await setup();
      const invite = await createInvite(u.email, '', '1', 0, ws.id);
      const reachedLimit = await increaseInviteUses(invite.token);
      expect(reachedLimit).toBe(true);
      expect(await fetchInviteUsingId(invite.token)).toBeUndefined();
    });
  });
});
