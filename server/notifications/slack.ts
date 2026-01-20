import {
  SlackSchema,
  SlackTemplateMessages,
} from '../../shared/notifications/slack.js';
import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { checkObjectAgainstSchema } from '../../shared/utils/schema.js';
import type { NotificationProps } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

class Slack extends NotificationBase {
  name = 'Slack';

  async send(
    notification: NotificationProps & {
      payload?: any;
      text?: string;
      channel?: string;
      username?: string;
    },
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const payload =
        SlackTemplateMessages[notification.messageType] || notification.payload;

      if (!payload) {
        throw new Error('Unable to find an payload');
      }

      const data = NotificationReplacers(
        payload,
        monitor as any,
        heartbeat as any
      );

      const safeData = typeof data === 'object' && data !== null ? data : {};
      if (
        !checkObjectAgainstSchema(
          safeData,
          SlackSchema as Record<string, any>
        ) ||
        !this.validateSlackBlocks((safeData as any).blocks)
      ) {
        throw new Error('Parsed payload is invalid format');
      }

      await axios.post(notification.token, {
        text: notification.text,
        channel: notification.channel,
        username: notification.username,
        attachments: [data],
      });

      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(
    notification: NotificationProps & { channel?: string; username?: string }
  ): Promise<void | string> {
    try {
      await axios.post(notification.token, {
        text: 'This is a test message from Lunalytics',
        channel: notification.channel,
        username: notification.username,
        attachments: [
          {
            color: '#36a64f',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'This is a test message from Lunalytics',
                },
              },
            ],
          },
        ],
      });
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(
    notification: NotificationProps & {
      text?: string;
      channel?: string;
      username?: string;
    },
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const template = SlackTemplateMessages.recovery;

      const data = NotificationReplacers(
        template,
        monitor as any,
        heartbeat as any
      );

      const safeData = typeof data === 'object' && data !== null ? data : {};
      if (
        !checkObjectAgainstSchema(
          safeData,
          SlackSchema as Record<string, any>
        ) ||
        !this.validateSlackBlocks((safeData as any).blocks)
      ) {
        throw new Error('Parsed payload is invalid format');
      }

      await axios.post(notification.token, {
        text: notification.text,
        channel: notification.channel,
        username: notification.username,
        attachments: [data],
      });

      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  validateSlackBlocks = (blocks: any[]): boolean => {
    if (!blocks?.length) {
      return false;
    }

    return blocks.every((block: any = {}) => {
      if (
        block.type === 'section' &&
        !block.text?.text?.trim() &&
        !block.fields?.length
      ) {
        return false; // Both fields and text is missing
      }

      if (block.fields?.length > 10) return false;

      return true;
    });
  };
}

export default Slack;
