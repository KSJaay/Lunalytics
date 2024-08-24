import Collection from '../../shared/utils/collection.js';
import { UnprocessableError } from '../../shared/utils/errors.js';
import {
  createNotification,
  deleteNotification,
  editNotification,
  fetchNotificationById,
  fetchNotifications,
  fetchNotificationUniqueId,
  toggleNotification,
} from '../database/queries/notification.js';

class Notifications {
  constructor() {
    this.notifications = new Collection();
  }

  async getAll() {
    if (this.notifications.size) {
      return this.notifications.toJSONValues();
    }

    const notifications = await fetchNotifications();
    for (const notification of notifications) {
      this.notifications.set(notification.id, notification);
    }

    return notifications;
  }

  async getById(id) {
    const notification = this.notifications.get(id);

    if (notification) {
      return notification;
    }

    const query = await fetchNotificationById(id);

    if (!query) {
      throw new UnprocessableError('Notification does not exist');
    }

    this.notifications.set(id, query);

    return query;
  }

  async create(notification, email) {
    const uniqueId = await fetchNotificationUniqueId();

    const query = await createNotification({
      ...notification,
      email,
      id: uniqueId,
      isEnabled: true,
    });

    this.notifications.set(uniqueId, query);
    return query;
  }

  async edit(notification) {
    const query = await editNotification(notification);

    this.notifications.set(notification.id, query);
    return query;
  }

  async toggle(id, enabled) {
    await toggleNotification(id, enabled);
    return;
  }

  async delete(id) {
    await deleteNotification(id);
    this.notifications.delete(id);
  }
}

export default Notifications;
