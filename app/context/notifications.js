import { action, computed, makeObservable, observable } from 'mobx';

class NotificationStore {
  constructor() {
    this.notifications = new Map();

    makeObservable(this, {
      notifications: observable,
      setNotifications: action,
      addNotification: action,
      deleteNotification: action,
      toggleNotification: action,
      getAllNotifications: computed,
    });
  }

  setNotifications = (notifications) => {
    for (const notification of notifications) {
      this.notifications.set(notification.id, notification);
    }
  };

  addNotification = (notification) => {
    this.notifications.set(notification.id, notification);
  };

  deleteNotification = (id) => {
    this.notifications.delete(id);
  };

  toggleNotification = (id, enabled) => {
    const notification = this.notifications.get(id);

    if (notification) {
      notification.isEnabled = enabled;
      this.notifications.set(id, notification);
    }
  };

  get getAllNotifications() {
    return Array.from(this.notifications.values()) || [];
  }
}

export default NotificationStore;
