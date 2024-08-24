import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { DiscordTemplateMessages } from '../../shared/notifications/discord.js';

class Discord extends NotificationBase {
  name = 'Discord';

  async send(notification, monitor, heartbeat) {
    try {
      const template =
        DiscordTemplateMessages[notification.type] || notification.payload;

      const embed = NotificationReplacers(template, monitor, heartbeat);

      await axios.post(notification.token, { ...embed });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Discord;
