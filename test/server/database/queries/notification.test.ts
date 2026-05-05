import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import database from '../../../../server/database/connection.js';
import {
  createNotification,
  deleteNotification,
  editNotification,
  fetchNotificationById,
  fetchNotifications,
  toggleNotification,
} from '../../../../server/database/queries/notification.js';

useTestDatabase();

const setup = async () => {
  const u = await seedUser();
  const ws = await seedWorkspace({ ownerId: u.email });
  return { u, ws };
};

const baseNotif = (id: string, workspaceId: string, email: string) => ({
  id,
  workspaceId,
  platform: 'discord',
  messageType: 'embed',
  token: 'tok',
  email,
  friendlyName: 'My Discord',
  isEnabled: '1',
  data: { webhook: 'https://x' },
});

describe('server/database/queries/notification', () => {
  describe('createNotification', () => {
    it('inserts a notification with stringified data', async () => {
      const { u, ws } = await setup();
      const result = await createNotification(baseNotif('n1', ws.id, u.email));

      expect(result.id).toBe('n1');
      const row = await fetchNotificationById('n1', ws.id);
      expect(row?.platform).toBe('discord');
      expect(row?.data).toEqual({ webhook: 'https://x' });
    });
  });

  describe('fetchNotifications', () => {
    it('returns only the workspace notifications, cleaned', async () => {
      const { u, ws } = await setup();
      await createNotification(baseNotif('n1', ws.id, u.email));
      await createNotification(baseNotif('n2', ws.id, u.email));

      const result = await fetchNotifications(ws.id);
      expect(result).toHaveLength(2);
      expect(result![0].isEnabled).toBe(true);
    });
  });

  describe('fetchNotificationById', () => {
    it('returns null for missing id or workspaceId', async () => {
      expect(await fetchNotificationById('', 'w')).toBeNull();
      expect(await fetchNotificationById('id', '')).toBeNull();
    });

    it('returns null when no row matches', async () => {
      const { ws } = await setup();
      expect(await fetchNotificationById('nope', ws.id)).toBeNull();
    });
  });

  describe('editNotification', () => {
    it('updates the existing row', async () => {
      const { u, ws } = await setup();
      await createNotification(baseNotif('n1', ws.id, u.email));
      await editNotification({
        ...baseNotif('n1', ws.id, u.email),
        friendlyName: 'Renamed',
      });
      const row = await fetchNotificationById('n1', ws.id);
      expect(row?.friendlyName).toBe('Renamed');
    });
  });

  describe('toggleNotification', () => {
    it('flips isEnabled', async () => {
      const { u, ws } = await setup();
      await createNotification(baseNotif('n1', ws.id, u.email));
      await toggleNotification('n1', ws.id, false);
      const row = await fetchNotificationById('n1', ws.id);
      expect(row?.isEnabled).toBe(false);
    });
  });

  describe('deleteNotification', () => {
    it('removes the row and unlinks any monitors using it', async () => {
      const { u, ws } = await setup();
      await createNotification(baseNotif('n1', ws.id, u.email));

      const client = await database.connect();

      await client!('monitor').insert({
        monitorId: 'mn1',
        name: 'M',
        url: 'https://x',
        type: 'http',
        email: u.email,
        workspaceId: ws.id,
        notificationId: 'n1',
      });

      await deleteNotification('n1', ws.id);

      expect(await fetchNotificationById('n1', ws.id)).toBeNull();
      const monitor = await client!('monitor')
        .where({ monitorId: 'mn1' })
        .first();
      expect(monitor.notificationId).toBeNull();
    });
  });
});
