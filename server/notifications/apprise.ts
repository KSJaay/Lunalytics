import axios from 'axios';
import NotificationBase from './base.js';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import { AppriseTemplateMessages } from '../../shared/notifications/apprise.js';

import type { NotificationProps } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

type AppriseNotificationProps = NotificationProps & {
  payload?: any;
  data: {
    urls: string;
    [key: string]: any;
  };
};

class Apprise extends NotificationBase {
  name = 'Apprise';

  async send(
    notification: AppriseNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template =
        AppriseTemplateMessages[notification.messageType] ||
        notification.payload;

      const content =
        NotificationReplacers(template, monitor as any, heartbeat as any) || {};
      const data = typeof content === 'object' ? content : { body: content };

      const urls = notification.data.urls
        .split(',')
        .map((url: string) => url.trim());

      await axios.post(notification.token, { ...data, urls });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification: AppriseNotificationProps): Promise<void | string> {
    try {
      const urls = notification.data.urls
        .split(',')
        .map((url: string) => url.trim());

      await axios.post(notification.token, {
        title: 'This is a test message',
        urls,
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(
    notification: AppriseNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template = AppriseTemplateMessages.recovery;

      const content =
        NotificationReplacers(template, monitor as any, heartbeat as any) || {};
      const data = typeof content === 'object' ? content : { body: content };

      const urls = notification.data.urls
        .split(',')
        .map((url: string) => url.trim());

      await axios.post(notification.token, { ...data, urls });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Apprise;
