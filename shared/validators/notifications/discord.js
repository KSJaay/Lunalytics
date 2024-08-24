// messageType: type of message for discord webhook (basic, pretty, nerdy)
// friendlyName: friendly name for discord webhook
// textMessage: text message for discord webhook (optional)
// token: url for discord webhook
// username: username for discord webhook (optional)

import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_ ]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const textMessageRegex = /^[a-zA-Z0-9_ ]+$/;
const tokenRegex =
  /^https:\/\/discord.com\/api\/webhooks\/[0-9]+\/[0-9a-zA-Z_.-]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{1,32}$/;

const Discord = ({
  messageType,
  friendlyName,
  textMessage,
  token,
  username,
}) => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, Spaces, and underscores only.'
    );
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (textMessage && !textMessageRegex.test(textMessage)) {
    throw new NotificationValidatorError('textMessage', 'Invalid Text Message');
  }

  if (!tokenRegex.test(token)) {
    throw new NotificationValidatorError(
      'token',
      'Invalid Discord Webhook URL'
    );
  }

  if (username && !usernameRegex.test(username)) {
    throw new NotificationValidatorError(
      'username',
      'Invalid Discord Webhook Username'
    );
  }

  return {
    platform: 'Discord',
    messageType,
    token,
    friendlyName,
    data: {
      textMessage,
      username,
    },
  };
};

export default Discord;
