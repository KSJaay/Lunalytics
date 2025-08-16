import { action, computed, makeObservable, observable } from 'mobx';
import type { NotificationProps } from '../types/notifications';

class NotificationStore {
  notifications: Map<string, NotificationProps>;
  activeNotification: NotificationProps | null | undefined;

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

  setNotifications = (notifications: NotificationProps[]) => {
    for (const notification of notifications) {
      this.notifications.set(notification.id, notification);
    }
  };

  addNotification = (notification: NotificationProps) => {
    this.notifications.set(notification.id, notification);

    if (notification.id === this.activeNotification?.id) {
      this.setActiveNotification(notification.id);
    }
  };

  deleteNotification = (id: string) => {
    this.notifications.delete(id);
  };

  toggleNotification = (id: string, enabled: boolean) => {
    const notification = this.notifications.get(id);

    if (notification) {
      notification.isEnabled = enabled;
      this.notifications.set(id, notification);
    }
  };

  getNotifciationById = (id: string) => {
    return this.notifications.get(id);
  };

  get allNotifications() {
    return Array.from(this.notifications.values()) || [];
  }

  setActiveNotification = (id?: string) => {
    if (!id || !this.notifications.has(id)) {
      this.activeNotification =
        this.notifications.values().next().value || null;
      return;
    }

    this.activeNotification = this.notifications.get(id);
  };
}

export default NotificationStore;
