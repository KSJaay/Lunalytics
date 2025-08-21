// friendlyName: Friendly name for the notification
// messageType: Type of message to send (basic, pretty, nerdy)
// token: Pushover API token
// data.userKey: Pushover user key
// data.device: Device id to send notification to
// data.messageTtl: How long the notification should live before being deleted
// data.priority: Priority level for the notification (-2, -1, 0, 1, 2)

import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];

const Pushover = ({ friendlyName, messageType, token, data }) => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (!token) {
    throw new NotificationValidatorError('token', 'Invalid Pushover API Token');
  }

  if (!data?.userKey) {
    throw new NotificationValidatorError(
      'userKey',
      'Invalid Pushover User Key'
    );
  }

  if (data?.messageTtl && !/^\d+$/.test(data.messageTtl)) {
    throw new NotificationValidatorError(
      'messageTtl',
      "Invalid Message TTL. Make sure it's a number"
    );
  }

  if (data?.priority) {
    const priorityAsInt = parseInt(data.priority);

    if (priorityAsInt < -2 || priorityAsInt > 2) {
      throw new NotificationValidatorError(
        'priority',
        'Invalid Pushover Priority. Must be -2, -1, 0, 1, or 2.'
      );
    }
  }

  return {
    platform: 'Pushover',
    messageType,
    token,
    friendlyName,
    data: {
      device: data.device,
      userKey: data.userKey,
      priority: data.priority ? parseInt(data.priority) : undefined,
      ttl: data.ttl ? parseInt(data.ttl) : undefined,
    },
  };
};

export default Pushover;
