// chatId: chat id for telegram webhook
// disableNotification: disable notification for telegram webhook (boolean)
// friendlyName: friendly name for telegram webhook
// message: type of message for telegram webhook (basic, pretty, nerdy)
// protectContent: protect content for telegram webhook (boolean)
// token: url for telegram webhook

import { NotificationValidatorError } from '../../utils/errors.js';

const chatIdRegex = /^[0-9]+$/;
const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const tokenRegex = /^[a-zA-Z0-9_]{1,32}$/;

const Telegram = ({
  chatId,
  disableNotification = false,
  friendlyName,
  messageType,
  protectContent = false,
  token,
}) => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (chatId && !chatIdRegex.test(chatId)) {
    throw new NotificationValidatorError('chatId', 'Invalid Chat ID');
  }

  if (typeof disableNotification !== 'boolean') {
    throw new NotificationValidatorError(
      'disableNotification',
      'Invalid Disable Notification'
    );
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (typeof protectContent !== 'boolean') {
    throw new NotificationValidatorError(
      'protectContent',
      'Invalid Protect Content'
    );
  }

  if (!tokenRegex.test(token)) {
    throw new NotificationValidatorError(
      'token',
      'Invalid Telegram Bot Token'
    );
  }

  return {
    platform: 'Telegram',
    messageType,
    token,
    friendlyName,
    data: {
      chatId,
      disableNotification,
      protectContent,
    },
  };
};

export default Telegram;
