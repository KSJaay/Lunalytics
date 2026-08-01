import { HeartbeatProps, MonitorProps } from '../../shared/types/monitor.js';
import { NotificationProps } from '../../shared/types/notifications.js';

const parseErrorData = (data: any) => {
  try {
    return JSON.stringify(data);
  } catch {
    return data;
  }
};

class NotificationBase {
  name?: string = undefined;
  success: string = 'Sent Successfully!';

  /**
   * Send a notification
   * @param {Object} notification Notification to send
   * @param {object} monitor Monitor details
   * @param {object} heartbeat Heartbeat details
   * @returns {Promise<string>} Return successful message
   * @throws Throws error about you being a dummy :)
   */

  async send(
    // oxlint-disable-next-line no-unused-vars
    notification: NotificationProps,
    // oxlint-disable-next-line no-unused-vars
    monitor: MonitorProps,
    // oxlint-disable-next-line no-unused-vars
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    throw new Error('Override this function dummy!');
  }

  async sendRecovery(
    // oxlint-disable-next-line no-unused-vars
    notification: NotificationProps,
    // oxlint-disable-next-line no-unused-vars
    monitor: MonitorProps,
    // oxlint-disable-next-line no-unused-vars
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    throw new Error('Override this function dummy!');
  }

  handleError(error: any): void {
    const message =
      error?.message || (typeof error === 'string' ? error : 'Unknown error');

    let info = 'Error: ' + message;

    if (error?.response?.data) {
      info += '\n' + parseErrorData(error.response.data);
    }

    throw new Error(info);
  }
}

export default NotificationBase;
