import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { WebhookTemplateMessages } from '../../shared/notifications/webhook.js';
import type { NotificationProps } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

class Webhook extends NotificationBase {
  name: string = 'Webhook';

  async send(
    notification: NotificationProps & {
      requestType?: string;
      customHeaders?: Record<string, string>;
      payload?: any;
    },
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const message =
        WebhookTemplateMessages[notification.messageType] ||
        notification.payload;

      let content: any = NotificationReplacers(
        message,
        monitor as any,
        heartbeat as any
      );
      let headers: Record<string, any> = {};

      if (notification.requestType === 'form-data') {
        const form = new (global as any).FormData();
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

  async test(notification: NotificationProps): Promise<void | string> {
    try {
      await axios.post(notification.token, {
        message: 'This is a test message from Lunalytics',
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(
    notification: NotificationProps & {
      requestType?: string;
      customHeaders?: Record<string, string>;
      payload?: any;
    },
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template = WebhookTemplateMessages.recovery;

      let content: any = NotificationReplacers(
        template,
        monitor as any,
        heartbeat as any
      );
      let headers: Record<string, any> = {};

      if (notification.requestType === 'form-data') {
        const form = new (global as any).FormData();
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
