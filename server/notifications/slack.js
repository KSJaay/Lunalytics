import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { checkObjectAgainstSchema } from '../../shared/utils/schema.js';
import {
  SlackSchema,
  SlackTemplateMessages,
} from '../../shared/notifications/slack.js';

class Slack extends NotificationBase {
  name = 'Slack';

  async send(notification, monitor, heartbeat) {
    try {
      const payload =
        SlackTemplateMessages[notification.messageType] || notification.payload;

      if (!payload) {
        throw new Error('Unable to find an payload');
      }

      const data = NotificationReplacers(payload, monitor, heartbeat);

      if (
        !checkObjectAgainstSchema(data, SlackSchema) ||
        !this.validateSlackBlocks(data.blocks)
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

  validateSlackBlocks = (blocks) => {
    if (!blocks?.length) {
      return false;
    }

    return blocks.every((block = {}) => {
      if (
        block.type === 'section' &&
        !block.text?.trim() &&
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
