const parseErrorData = (data) => {
  try {
    JSON.stringify(data);
  } catch (error) {
    return data;
  }
};

class NotificationBase {
  name = undefined;
  success = 'Sent Successfully!';

  /**
   * Send a notification
   * @param {Object} notification Notification to send
   * @param {string} message Message attached to notification
   * @param {object} monitor Monitor details
   * @param {object} heartbeat Heartbeat details
   * @returns {Promise<string>} Return successful message
   * @throws Throws error about you being a dummy :)
   */

  // eslint-disable-next-line no-unused-vars
  async send(notification, message, monitor, heartbeat) {
    throw new Error('Override this function dummy!');
  }

  handleError(error) {
    let info = 'Error: ' + error + '\n';

    if (error?.response?.data) {
      info += parseErrorData(error.response.data);
    }

    throw new Error(info);
  }
}

export default NotificationBase;
