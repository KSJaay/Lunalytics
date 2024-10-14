import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { TelegramTemplateMessages } from '../../shared/notifications/telegram.js';

class Telegram extends NotificationBase {
  name = 'Telegram';

  async send(notification, monitor, heartbeat) {
    try {
      const url = 'https://api.telegram.org/bot';

      const message =
        TelegramTemplateMessages[notification.messageType] ||
        notification.payload;

      const params = {
        text: message,
        chat_id: notification.chatId,
        disable_notification: notification.disableNotification ?? false,
        parse_mode: notification.parseMode || 'MarkdownV2',
        protect_content: notification.protectContent ?? false,
      };

      params.text = NotificationReplacers(message, monitor, heartbeat, true);

      await axios.get(`${url}${notification.token}/sendMessage`, { params });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(notification, monitor, heartbeat) {
    try {
      const url = 'https://api.telegram.org/bot';

      const message = TelegramTemplateMessages.recovery;

      const params = {
        text: message,
        chat_id: notification.chatId,
        disable_notification: notification.disableNotification ?? false,
        parse_mode: notification.parseMode || 'MarkdownV2',
        protect_content: notification.protectContent ?? false,
      };

      params.text = NotificationReplacers(message, monitor, heartbeat, true);

      await axios.get(`${url}${notification.token}/sendMessage`, { params });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Telegram;
