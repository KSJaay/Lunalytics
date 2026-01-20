import database from '../connection.js';
import {
  cleanNotification,
  stringifyNotification,
} from '../../class/notification.js';

export const fetchNotifications = async (workspaceId: string) => {
  const client = await database.connect();
  const notifications = await client?.('notifications')
    .where({ workspaceId })
    .select();

  return notifications?.map((notification) => cleanNotification(notification));
};

export const fetchNotificationById = async (
  id: string,
  workspaceId: string
) => {
  if (!id || !workspaceId) return null;

  const client = await database.connect();
  const notification = await client?.('notifications')
    .where({ id, workspaceId })
    .select()
    .first();

  if (!notification) return null;

  return cleanNotification(notification);
};

export const createNotification = async (notification: any) => {
  const client = await database.connect();

  await client?.('notifications').insert(stringifyNotification(notification));

  return cleanNotification(notification);
};

export const editNotification = async (notification: any) => {
  const client = await database.connect();

  await client?.('notifications')
    .where({ id: notification.id, workspaceId: notification.workspaceId })
    .update(stringifyNotification(notification));

  return cleanNotification(notification);
};

export const toggleNotification = async (
  id: string,
  workspaceId: string,
  isEnabled: boolean = true
) => {
  const client = await database.connect();

  await client?.('notifications')
    .where({ id, workspaceId })
    .update({ isEnabled });

  return;
};

export const deleteNotification = async (id: string, workspaceId: string) => {
  const client = await database.connect();

  await client?.('notifications').where({ id, workspaceId }).del();
  await client?.('monitor')
    .where({ notificationId: id, workspaceId })
    .update({ notificationId: null });

  return;
};
