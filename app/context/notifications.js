import { action, computed, makeObservable, observable } from 'mobx';

class NotificationStore {
  constructor() {
    this.notifications = observable.map();
    this.activeNotification = null;

    makeObservable(this, {
      notifications: observable,
      activeNotification: observable,
      setNotifications: action,
      addNotification: action,
      deleteNotification: action,
      toggleNotification: action,
      allNotifications: computed,
      setActiveNotification: action,
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

  getNotifciationById = (id) => {
    return this.notifications.get(id);
  };

  get allNotifications() {
    return Array.from(this.notifications.values()) || [];
  }

  setActiveNotification = (id) => {
    if (!id || !this.notifications.has(id)) {
      this.activeNotification =
        this.notifications.values().next().value || null;
      return;
    }

    this.activeNotification = this.notifications.get(id);
  };
}

export default NotificationStore;
