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
    // eslint-disable-next-line no-unused-vars @ts-ignore
    notification: NotificationProps,
    // eslint-disable-next-line no-unused-vars @ts-ignore
    monitor: MonitorProps,
    // eslint-disable-next-line no-unused-vars @ts-ignore
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    throw new Error('Override this function dummy!');
  }

  async sendRecovery(
    // eslint-disable-next-line no-unused-vars @ts-ignore
    notification: NotificationProps,
    // eslint-disable-next-line no-unused-vars @ts-ignore
    monitor: MonitorProps,
    // eslint-disable-next-line no-unused-vars @ts-ignore
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
