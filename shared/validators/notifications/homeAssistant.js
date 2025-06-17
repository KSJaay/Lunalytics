// additionalHeaders: additional headers for HomeAssistant webhook
// friendlyName: friendly name for HomeAssistant webhook
// messageType: type of message for HomeAssistant webhook (basic, pretty, nerdy)
// requestType: type of request for HomeAssistant webhook (application/json, form-data)
// showAdditionalHeaders: show additional headers for HomeAssistant webhook
// token: url for HomeAssistant webhook (Needs to be a http or https url)

import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const requestTypes = ['application/json', 'form-data'];
const homeAssistantUrlRegex = /^.+$/;
const homeAssistantNotificationServiceRegex = /^.+$/;
const tokenRegex = /^.+$/;

const HomeAssistant = ({
  friendlyName,
  messageType,
  requestType = 'application/json',
  token,
  homeAssistantUrl,
  homeAssistantNotificationService,
}) => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (homeAssistantUrlRegex && !homeAssistantUrlRegex.test(homeAssistantUrl)) {
    throw new NotificationValidatorError('homeAssistantUrl', 'Invalid HomeAssistant URL');
  }

  if (homeAssistantNotificationServiceRegex && !homeAssistantNotificationServiceRegex.test(homeAssistantNotificationService)) {
    throw new NotificationValidatorError('homeAssistantNotificationService', 'Invalid HomeAssistant Notification Service');
  }

  if (tokenRegex && !tokenRegex.test(token)) {
    throw new NotificationValidatorError('token', 'Invalid Access Token');
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (!requestTypes.includes(requestType)) {
    throw new NotificationValidatorError('requestType', 'Invalid Request Type');
  }

  return {
    platform: 'HomeAssistant',
    messageType,
    token,
    friendlyName,
    data: {
        homeAssistantUrl,
        homeAssistantNotificationService,
    }
  };
};

export default HomeAssistant; 