import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { PushoverTemplateMessages } from '../../shared/notifications/pushover.js';
import config from '../utils/config.js';

class Pushover extends NotificationBase {
  name = 'Pushover';

  getConfig(notification) {
    const data = {
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

  async send(notification, monitor, heartbeat) {
    try {
      const template =
        PushoverTemplateMessages[notification.messageType] ||
        notification.payload;

      const message = NotificationReplacers(template, monitor, heartbeat);
      const data = this.getConfig(notification);

      await axios.post('https://api.pushover.net/1/messages.json', {
        ...data,
        ...message,
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(notification, monitor, heartbeat) {
    try {
      const template = PushoverTemplateMessages.recovery;

      const message = NotificationReplacers(template, monitor, heartbeat);
      const data = this.getConfig(notification);

      await axios.post('https://api.pushover.net/1/messages.json', {
        ...data,
        ...message,
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Pushover;
