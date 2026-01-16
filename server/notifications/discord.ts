import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { DiscordTemplateMessages } from '../../shared/notifications/discord.js';

class Discord extends NotificationBase {
  name = 'Discord';

  async send(notification, monitor, heartbeat) {
    try {
      const template =
        DiscordTemplateMessages[notification.messageType] ||
        notification.payload;

      const embed = NotificationReplacers(template, monitor, heartbeat);

      await axios.post(notification.token, { ...embed });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification) {
    try {
      await axios.post(notification.token, {
        content: 'This is a test message',
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(notification, monitor, heartbeat) {
    try {
      const template = DiscordTemplateMessages.recovery;

      const embed = NotificationReplacers(template, monitor, heartbeat);

      await axios.post(notification.token, { ...embed });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Discord;
