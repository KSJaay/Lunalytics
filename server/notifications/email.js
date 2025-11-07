
import NotificationBase from './base.js';

class Email extends NotificationBase {
  name = 'Email';

  async send(notification, monitor, heartbeat) {
    try {
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification) {
    try {
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(notification, monitor, heartbeat) {
    try {
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Discord;
