import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { TelegramTemplateMessages } from '../../shared/notifications/telegram.js';
import type { NotificationProps } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

type TelegramNotificationProps = NotificationProps & {
  payload?: any;
  data: {
    chatId?: string;
    disableNotification?: boolean;
    protectContent?: boolean;
    parseMode?: string;
    [key: string]: any;
  };
};

function escapeMarkdownV2(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

class Telegram extends NotificationBase {
  name = 'Telegram';

  async send(
    notification: TelegramNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const url = 'https://api.telegram.org/bot';

      const message =
        TelegramTemplateMessages[notification.messageType] ||
        notification.payload;

      const replacedText = NotificationReplacers(
        message,
        monitor as any,
        heartbeat as any,
        true
      );
      const safeText =
        typeof replacedText === 'string'
          ? replacedText
          : JSON.stringify(replacedText);
      const escapedText = escapeMarkdownV2(safeText);

      const params = {
        text: escapedText,
        chat_id: notification.data?.chatId,
        disable_notification: notification.data?.disableNotification ?? false,
        parse_mode: notification.data?.parseMode || 'MarkdownV2',
        protect_content: notification.data?.protectContent ?? false,
      };

      await axios.get(`${url}${notification.token}/sendMessage`, { params });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification: TelegramNotificationProps): Promise<void | string> {
    try {
      const url = 'https://api.telegram.org/bot';

      const params = {
        text: 'This is a test message from Lunalytics',
        chat_id: notification.data?.chatId,
        disable_notification: notification.data?.disableNotification ?? false,
        parse_mode: notification.data?.parseMode || 'MarkdownV2',
        protect_content: notification.data?.protectContent ?? false,
      };

      await axios.get(`${url}${notification.token}/sendMessage`, { params });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(
    notification: TelegramNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const url = 'https://api.telegram.org/bot';

      const message = TelegramTemplateMessages.recovery;

      const replacedText = NotificationReplacers(
        message,
        monitor as any,
        heartbeat as any,
        true
      );
      const safeText =
        typeof replacedText === 'string'
          ? replacedText
          : JSON.stringify(replacedText);
      const escapedText = escapeMarkdownV2(safeText);

      const params = {
        text: escapedText,
        chat_id: notification.data?.chatId,
        disable_notification: notification.data?.disableNotification ?? false,
        parse_mode: notification.data?.parseMode || 'MarkdownV2',
        protect_content: notification.data?.protectContent ?? false,
      };

      await axios.get(`${url}${notification.token}/sendMessage`, { params });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Telegram;
