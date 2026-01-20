import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { PushoverTemplateMessages } from '../../shared/notifications/pushover.js';
import config from '../utils/config.js';
import type { NotificationProps } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

type PushoverNotificationProps = NotificationProps & {
  payload?: any;
  data: {
    userKey: string;
    device?: string;
    priority?: string | number;
    ttl?: string | number;
    [key: string]: any;
  };
};

class Pushover extends NotificationBase {
  name = 'Pushover';

  getConfig(notification: PushoverNotificationProps): Record<string, any> {
    const data: Record<string, any> = {
      token: notification.token,
      user: notification.data.userKey,
      retry: '30',
      expire: '3600',
      html: '1',
      priority: notification.data.priority || 0,
    };

    const websiteUrl = config.get('websiteUrl');

    if (websiteUrl) {
      data.url = `${websiteUrl}/home`;
      data.url_title = 'Open Dashboard';
    }

    if (notification.data.device) {
      data.device = notification.data.device;
    }

    if (notification.data.ttl) {
      data.ttl = notification.data.ttl;
    }

    return data;
  }

  async send(
    notification: PushoverNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template =
        PushoverTemplateMessages[notification.messageType] ||
        notification.payload;

      const message = NotificationReplacers(
        template,
        monitor as any,
        heartbeat as any
      );
      const data = this.getConfig(notification);

      const content =
        typeof message === 'object' && message !== null ? message : { message };

      await axios.post('https://api.pushover.net/1/messages.json', {
        ...data,
        ...content,
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(
    notification: PushoverNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template = PushoverTemplateMessages.recovery;

      const message = NotificationReplacers(
        template,
        monitor as any,
        heartbeat as any
      );
      const data = this.getConfig(notification);

      const content =
        typeof message === 'object' && message !== null ? message : { message };

      await axios.post('https://api.pushover.net/1/messages.json', {
        ...data,
        ...content,
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification: PushoverNotificationProps): Promise<void | string> {
    try {
      const data = this.getConfig(notification);

      await axios.post('https://api.pushover.net/1/messages.json', {
        ...data,
        message: 'This is a test message from Lunalytics',
        title: 'Lunalytics Test Message',
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Pushover;
