import axios from 'axios';
import NotificationBase from './base.js';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import { AppriseTemplateMessages } from '../../shared/notifications/apprise.js';

class Apprise extends NotificationBase {
  name = 'Apprise';

  async send(notification, monitor, heartbeat) {
    try {
      const template =
        AppriseTemplateMessages[notification.messageType] ||
        notification.payload;

      const content = NotificationReplacers(template, monitor, heartbeat);

      await axios.post(notification.token, {
        ...content,
        urls: notification.data.urls.split(',').map((url) => url.trim()),
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification) {
    try {
      await axios.post(notification.token, {
        title: 'This is a test message',
        urls: notification.data.urls.split(',').map((url) => url.trim()),
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(notification, monitor, heartbeat) {
    try {
      const template = AppriseTemplateMessages.recovery;

      const content = NotificationReplacers(template, monitor, heartbeat);

      await axios.post(notification.token, {
        ...content,
        urls: notification.data.urls.split(',').map((url) => url.trim()),
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Apprise;
