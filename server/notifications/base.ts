const parseErrorData = (data) => {
  try {
    return JSON.stringify(data);
  } catch {
    return data;
  }
};

class NotificationBase {
  name = undefined;
  success = 'Sent Successfully!';

  /**
   * Send a notification
   * @param {Object} notification Notification to send
   * @param {object} monitor Monitor details
   * @param {object} heartbeat Heartbeat details
   * @returns {Promise<string>} Return successful message
   * @throws Throws error about you being a dummy :)
   */

  // eslint-disable-next-line no-unused-vars
  async send(notification, monitor, heartbeat) {
    throw new Error('Override this function dummy!');
  }

  // eslint-disable-next-line no-unused-vars
  async sendRecovery(notification, monitor, heartbeat) {
    throw new Error('Override this function dummy!');
  }

  handleError(error) {
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
