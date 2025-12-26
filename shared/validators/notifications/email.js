import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const tokenRegex =
  /^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/[0-9]+\/[0-9a-zA-Z_.-]+$/;

const Email = ({
  friendlyName,
  token,
  messageType,
  data: {
    port = 587,
    security = true,
    username,
    password,
    fromEmail,
    toEmail,
    ccEmail,
    bccEmail,
  } = {},
}) => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (!token) {
    throw new NotificationValidatorError('token', 'Invalid Email Webhook URL');
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (!port) {
    throw new NotificationValidatorError('port', 'Invalid Port');
  }

  if (security === undefined) {
    throw new NotificationValidatorError(
      'security',
      'Invalid Security Setting'
    );
  }

  if (!username) {
    throw new NotificationValidatorError('username', 'Invalid Username');
  }

  if (!password) {
    throw new NotificationValidatorError('password', 'Invalid Password');
  }

  return {
    platform: 'Email',
    messageType,
    token,
    friendlyName,
    data: {
      port,
      security,
      username,
      password,
      fromEmail,
      toEmail,
      ccEmail,
      bccEmail,
    },
  };
};

export default Email;
