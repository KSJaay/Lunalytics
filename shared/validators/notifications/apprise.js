import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];

const Apprise = ({ messageType, friendlyName, token, data: { urls } = {} }) => {
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
    throw new NotificationValidatorError(
      'token',
      'Invalid Apprise Webhook URL'
    );
  }

  if (!urls) {
    throw new NotificationValidatorError('urls', 'Invalid Apprise URLs');
  }

  return {
    platform: 'Apprise',
    messageType,
    token,
    friendlyName,
    data: {
      urls,
    },
  };
};

export default Apprise;
