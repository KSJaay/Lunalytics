import { v4 as uuidv4 } from 'uuid';
import SQLite from '../sqlite/setup.js';
import {
  cleanNotification,
  stringifyNotification,
} from '../../class/notification.js';

export const fetchNotifications = async () => {
  const notifications = await SQLite.client('notifications').select();

  return notifications.map((notification) => cleanNotification(notification));
};

export const fetchNotificationById = async (id) => {
  const notification = await SQLite.client('notifications')
    .where({ id })
    .select()
    .first();

  return cleanNotification(notification);
};

export const fetchNotificationUniqueId = async () => {
  let id = uuidv4();

  while (await SQLite.client('notifications').where({ id }).first()) {
    id = uuidv4();
  }

  return id;
};

export const createNotification = async (notification) => {
  await SQLite.client('notifications').insert(
    stringifyNotification(notification)
  );

  return cleanNotification(notification);
};

export const editNotification = async (notification) => {
  await SQLite.client('notifications')
    .where({ id: notification.id })
    .update(stringifyNotification(notification));

  return cleanNotification(notification);
};

export const toggleNotification = async (id, isEnabled = true) => {
  await SQLite.client('notifications').where({ id }).update({ isEnabled });

  return;
};

export const deleteNotification = async (id) => {
  await SQLite.client('notifications').where({ id }).del();
};
