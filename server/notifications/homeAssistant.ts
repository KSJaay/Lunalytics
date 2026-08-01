import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { HomeAssistantTemplateMessages } from '../../shared/notifications/homeAssistant.js';
import type { NotificationProps } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

type HomeAssistantNotificationProps = NotificationProps & {
  payload?: any;
  data: {
    homeAssistantUrl: string;
    homeAssistantNotificationService: string;
    [key: string]: any;
  };
};

class HomeAssistant extends NotificationBase {
  name = 'HomeAssistant';

  async send(
    notification: HomeAssistantNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    const template =
      HomeAssistantTemplateMessages[notification.messageType] ||
      notification.payload;
    await this.sendNotification(notification, monitor, heartbeat, template);

    return this.success;
  }

  async sendRecovery(
    notification: HomeAssistantNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    await this.sendNotification(
      notification,
      monitor,
      heartbeat,
      HomeAssistantTemplateMessages.recovery
    );

    return this.success;
  }

  async sendNotification(
    notification: HomeAssistantNotificationProps,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps,
    template: any
  ): Promise<void | string> {
    try {
      const embed = NotificationReplacers(
        template,
        monitor as any,
        heartbeat as any
      );

      const data =
        typeof embed === 'object' && embed !== null
          ? embed
          : { message: embed };

      await axios.post(
        `${notification.data.homeAssistantUrl
          .trim()
          .replace(/\/*$/, '')}/api/services/notify/${
          notification.data.homeAssistantNotificationService
        }`,
        data,
        {
          headers: {
            Authorization: `Bearer ${notification.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(
    notification: HomeAssistantNotificationProps
  ): Promise<void | string> {
    try {
      await axios.post(
        `${notification.data.homeAssistantUrl
          .trim()
          .replace(/\/*$/, '')}/api/services/notify/${
          notification.data.homeAssistantNotificationService
        }`,
        {
          message: 'This is a test message from Lunalytics',
          title: 'Lunalytics Test Message',
        },
        {
          headers: {
            Authorization: `Bearer ${notification.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default HomeAssistant;
