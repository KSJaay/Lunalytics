import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { WebhookTemplateMessages } from '../../shared/notifications/webhook.js';

class Webhook extends NotificationBase {
  name = 'Webhook';

  async send(notification, monitor, heartbeat) {
    try {
      const message =
        WebhookTemplateMessages[notification.messageType] ||
        notification.payload;

      let content = NotificationReplacers(message, monitor, heartbeat);
      let headers = {};

      if (notification.requestType === 'form-data') {
        // Change to form data from json
        const form = new FormData();
        form.append('data', JSON.stringify(content));
        headers = form.getHeaders();
        content = form;
      }

      if (notification.customHeaders) {
        headers = { ...headers, ...notification.customHeaders };
      }

      await axios.post(notification.token, content, { headers });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Webhook;
