import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { DiscordTemplateMessages } from '../../shared/notifications/discord.js';
import type { NotificationProps } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

class Discord extends NotificationBase {
  name = 'Discord';

  async send(
    notification: NotificationProps & { payload?: any },
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template =
        DiscordTemplateMessages[notification.messageType] ||
        notification.payload;

      const embed = NotificationReplacers(
        template,
        monitor as any,
        heartbeat as any
      );

      const data =
        typeof embed === 'object' && embed !== null
          ? embed
          : { content: embed };

      await axios.post(notification.token, data);
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification: NotificationProps): Promise<void | string> {
    try {
      await axios.post(notification.token, {
        content: 'This is a test message',
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(
    notification: NotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template = DiscordTemplateMessages.recovery;

      const embed = NotificationReplacers(
        template,
        monitor as any,
        heartbeat as any
      );

      const data =
        typeof embed === 'object' && embed !== null
          ? embed
          : { content: embed };

      await axios.post(notification.token, data);
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Discord;
