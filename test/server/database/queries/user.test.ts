import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import database from '../../../../server/database/connection.js';
import { verifyPassword } from '../../../../server/utils/hashPassword.js';
import {
  approveAccess,
  calculateMemberCountForWorkspaces,
  declineAccess,
  emailIsOwner,
  fetchUserWorkspaces,
  getUserByEmail,
  getUserPasswordUsingEmail,
  ownerExists,
  registerSsoUser,
  registerUser,
  resetDemoUser,
  signInUser,
  transferOwnership,
  updateUserAvatar,
  updateUserDisplayname,
  updateUserPassword,
  updateUserPermission,
  updateUserSettings,
} from '../../../../server/database/queries/user.js';
import {
  AuthorizationError,
  ConflictError,
} from '../../../../shared/utils/errors.js';
import { oldPermsToFlags } from '../../../../shared/permissions/oldPermsToFlags.js';

useTestDatabase();

describe('server/database/queries/user', () => {
  describe('registerUser', () => {
    it('hashes the password and inserts the row', async () => {
      const result = await registerUser({
        email: 'NewUser@Test.LOCAL',
        password: 'plaintext',
        displayName: 'New',
        avatar: null,
        isVerified: false,
      });

      expect(result.email).toBe('newuser@test.local');
      expect(result.password).not.toBe('plaintext');

      const client = await database.connect();
      const row = await client!('user')
        .where({ email: 'newuser@test.local' })
        .first();
      expect(row.displayName).toBe('New');
      expect(verifyPassword('plaintext', row.password)).toBe(true);
    });

    it('throws ConflictError on duplicate email', async () => {
      await seedUser({ email: 'dupe@test.local' });
      await expect(
        registerUser({
          email: 'dupe@test.local',
          password: 'x',
          displayName: 'd',
        })
      ).rejects.toBeInstanceOf(ConflictError);
    });
  });

  describe('signInUser', () => {
    it('returns the user when credentials match', async () => {
      const seeded = await seedUser({
        email: 'signin@test.local',
        password: 'pw',
      });
      const user = await signInUser('signin@test.local', 'pw');
      expect(user.email).toBe(seeded.email);
    });

    it('throws AuthorizationError when the user does not exist', async () => {
      await expect(
        signInUser('missing@test.local', 'pw')
      ).rejects.toBeInstanceOf(AuthorizationError);
    });

    it('throws AuthorizationError for an SSO user', async () => {
      await seedUser({ email: 'sso@test.local', sso: true });
      await expect(signInUser('sso@test.local', 'pw')).rejects.toBeInstanceOf(
        AuthorizationError
      );
    });

    it('throws AuthorizationError when the password is wrong', async () => {
      await seedUser({ email: 'wp@test.local', password: 'right' });
      await expect(signInUser('wp@test.local', 'wrong')).rejects.toBeInstanceOf(
        AuthorizationError
      );
    });
  });

  describe('registerSsoUser', () => {
    it('inserts both user and connections rows', async () => {
      await registerSsoUser({
        email: 'sso2@test.local',
        displayName: 'SSO',
        avatar: 'a',
        sso: true,
        id: 'oauth-id-1',
        provider: 'github',
        isVerified: true,
      });

      const client = await database.connect();
      const user = await client!('user')
        .where({ email: 'sso2@test.local' })
        .first();
      expect(user).toBeDefined();
      expect(user.password).toBeNull();

      const conn = await client!('connections')
        .where({ accountId: 'oauth-id-1' })
        .first();
      expect(conn.provider).toBe('github');
      expect(conn.email).toBe('sso2@test.local');
    });
  });

  describe('getUserByEmail', () => {
    it('returns the user without password and parses settings', async () => {
      await seedUser({
        email: 'fetch@test.local',
        settings: { theme: 'dark' },
      });
      const user = await getUserByEmail('fetch@test.local');
      expect(user.email).toBe('fetch@test.local');
      expect(user.password).toBeUndefined();
      expect(user.settings).toEqual({ theme: 'dark' });
    });

    it('returns undefined for an unknown email', async () => {
      expect(await getUserByEmail('nope@test.local')).toBeUndefined();
    });
  });

  describe('emailIsOwner', () => {
    it('returns the isOwner flag for the user', async () => {
      await seedUser({ email: 'owner@test.local', isOwner: true });
      const result = await emailIsOwner('owner@test.local');
      expect(result?.isOwner).toBeTruthy();
    });
  });

  describe('ownerExists', () => {
    it('returns the first user when present', async () => {
      await seedUser({ email: 'first@test.local' });
      const result = await ownerExists();
      expect(result?.email).toBe('first@test.local');
    });

    it('returns undefined when no user exists', async () => {
      expect(await ownerExists()).toBeUndefined();
    });
  });

  describe('getUserPasswordUsingEmail', () => {
    it('returns the hashed password', async () => {
      const seeded = await seedUser({ password: 'pw' });
      const hash = await getUserPasswordUsingEmail(seeded.email);
      expect(verifyPassword('pw', hash)).toBe(true);
    });

    it('throws AuthorizationError for unknown email', async () => {
      await expect(getUserPasswordUsingEmail('x@x')).rejects.toBeInstanceOf(
        AuthorizationError
      );
    });
  });

  describe('updateUserDisplayname', () => {
    it('updates the display name', async () => {
      const u = await seedUser();
      await updateUserDisplayname(u.email, 'New Name');
      const row = await getUserByEmail(u.email);
      expect(row.displayName).toBe('New Name');
    });
  });

  describe('updateUserAvatar', () => {
    it('updates the avatar', async () => {
      const u = await seedUser();
      await updateUserAvatar(u.email, 'http://avatar');
      const row = await getUserByEmail(u.email);
      expect(row.avatar).toBe('http://avatar');
    });
  });

  describe('declineAccess', () => {
    it('removes the user and their sessions', async () => {
      const u = await seedUser();
      const client = await database.connect();
      await client!('user_session').insert({
        email: u.email,
        sessionId: 's1',
        device: 'd',
        data: null,
        created_at: new Date().toISOString(),
      });

      await declineAccess(u.email);

      expect(
        await client!('user').where({ email: u.email }).first()
      ).toBeUndefined();
      expect(
        await client!('user_session').where({ email: u.email }).first()
      ).toBeUndefined();
    });
  });

  describe('approveAccess', () => {
    it('flips isVerified to true', async () => {
      const u = await seedUser({ isVerified: false });
      await approveAccess(u.email);
      const client = await database.connect();
      const row = await client!('user').where({ email: u.email }).first();
      expect(row.isVerified).toBeTruthy();
    });

    it('throws when user does not exist', async () => {
      await expect(approveAccess('nope@x')).rejects.toBeInstanceOf(
        AuthorizationError
      );
    });
  });

  describe('updateUserPermission', () => {
    it('updates the permission flag', async () => {
      const u = await seedUser();
      await updateUserPermission(u.email, '5');
      const client = await database.connect();
      const row = await client!('user').where({ email: u.email }).first();
      expect(row.permission).toBe(5);
    });

    it('throws when user does not exist', async () => {
      await expect(updateUserPermission('nope@x', '1')).rejects.toBeInstanceOf(
        AuthorizationError
      );
    });
  });

  describe('updateUserPassword', () => {
    it('hashes and updates the password', async () => {
      const u = await seedUser({ password: 'old' });
      await updateUserPassword(u.email, 'new');
      const hash = await getUserPasswordUsingEmail(u.email);
      expect(verifyPassword('new', hash)).toBe(true);
      expect(verifyPassword('old', hash)).toBe(false);
    });
  });

  describe('updateUserSettings', () => {
    it('serialises and stores settings', async () => {
      const u = await seedUser();
      await updateUserSettings(u.email, { theme: 'light' });
      const row = await getUserByEmail(u.email);
      expect(row.settings).toEqual({ theme: 'light' });
    });
  });

  describe('resetDemoUser', () => {
    it('is a no-op when no demo user exists', async () => {
      await expect(resetDemoUser()).resolves.toBeUndefined();
    });

    it('resets fields when the demo user exists', async () => {
      await seedUser({ email: 'demo', displayName: 'Changed' });
      await resetDemoUser();
      const client = await database.connect();
      const row = await client!('user').where({ email: 'demo' }).first();
      expect(row.displayName).toBe('Demo User');
      expect(row.permission).toBe(oldPermsToFlags[4]);
    });
  });

  describe('transferOwnership', () => {
    it('demotes the current owner and promotes the new one', async () => {
      const a = await seedUser();
      const b = await seedUser();

      await transferOwnership(a.email, b.email);
      const client = await database.connect();
      const aRow = await client!('user').where({ email: a.email }).first();
      const bRow = await client!('user').where({ email: b.email }).first();

      expect(aRow.permission).toBe(oldPermsToFlags[4]);
      expect(bRow.permission).toBe(oldPermsToFlags[1]);
    });
  });

  describe('fetchUserWorkspaces', () => {
    it('returns workspaces the user is a member of', async () => {
      const u = await seedUser();
      const ws = await seedWorkspace({ ownerId: u.email, name: 'WS' });
      const result = await fetchUserWorkspaces(u.email);
      expect(result).toEqual([{ id: ws.id, name: 'WS', icon: null }]);
    });

    it('returns an empty list for users with no membership', async () => {
      const u = await seedUser();
      expect(await fetchUserWorkspaces(u.email)).toEqual([]);
    });
  });

  describe('calculateMemberCountForWorkspaces', () => {
    it('updates each workspace memberCount to its actual member rows', async () => {
      const owner = await seedUser();
      const ws = await seedWorkspace({ ownerId: owner.email, memberCount: 99 });

      const second = await seedUser();
      const client = await database.connect();
      await client!('member').insert({
        email: second.email,
        workspaceId: ws.id,
        permission: 0,
      });

      await calculateMemberCountForWorkspaces();

      const updated = await client!('workspace').where({ id: ws.id }).first();
      expect(updated.memberCount).toBe(2);
    });
  });
});
