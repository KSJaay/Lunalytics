import axios from 'axios';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import NotificationBase from './base.js';
import { HomeAssistantTemplateMessages } from '../../shared/notifications/homeAssistant.js';

class HomeAssistant extends NotificationBase {
  name = 'HomeAssistant';

  async send(notification, monitor, heartbeat) {
      const template = HomeAssistantTemplateMessages[notification.messageType] ||
        notification.payload;

      this.sendNotification(notification, monitor, heartbeat, template);
  }

  async sendRecovery(notification, monitor, heartbeat) {
      this.sendNotification(notification, monitor, heartbeat, HomeAssistantTemplateMessages.recovery);
  }

  async sendNotification(notification, monitor, heartbeat, template) {
    try {

      const embed = NotificationReplacers(template, monitor, heartbeat);

      await axios.post(
        `${notification.data.homeAssistantUrl.trim().replace(/\/*$/, "")}/api/services/notify/${notification.data.homeAssistantNotificationService}`,
        { ...embed },
        {
          headers: {
            'Authorization': `Bearer ${notification.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.success;
    }
    catch (error) {
      this.handleError(error);
    }
  }
}

export default HomeAssistant;