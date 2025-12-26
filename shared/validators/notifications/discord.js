// messageType: type of message for discord webhook (basic, pretty, nerdy)
// friendlyName: friendly name for discord webhook
// token: url for discord webhook
// username: username for discord webhook (optional)

import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const tokenRegex =
  /^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/[0-9]+\/[0-9a-zA-Z_.-]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{1,32}$/;

const Discord = ({
  messageType,
  friendlyName,
  token,
  data: { textMessage, username } = {},
}) => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (!tokenRegex.test(token)) {
    throw new NotificationValidatorError(
      'token',
      'Invalid Discord Webhook URL'
    );
  }

  console.log(
    'username && !usernameRegex',
    username && !usernameRegex.test(username)
  );

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
