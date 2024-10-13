// channel: channel name for slack webhook (e.g. #lunalytics-alerts) (optional)
// friendlyName: friendly name for slack webhook
// message: type of message for discord webhook (basic, pretty, nerdy)
// textMessage: text message for discord webhook (optional)
// token: url for discord webhook
// username: username for discord webhook (optional)

import { NotificationValidatorError } from '../../utils/errors.js';

const channelRegex = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const tokenRegex =
  /^https:\/\/hooks.slack.com\/services\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{1,32}$/;

const Slack = ({
  channel,
  friendlyName,
  messageType,
  textMessage,
  token,
  username,
}) => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (channel && !channelRegex.test(channel)) {
    throw new NotificationValidatorError('channel', 'Invalid Channel Name');
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (!tokenRegex.test(token)) {
    throw new NotificationValidatorError('token', 'Invalid Slack Webhook URL');
  }

  if (username && !usernameRegex.test(username)) {
    throw new NotificationValidatorError(
      'username',
      'Invalid Slack Webhook Username'
    );
  }

  return {
    platform: 'Slack',
    messageType,
    token,
    friendlyName,
    data: {
      channel,
      textMessage,
      username,
    },
  };
};

export default Slack;
