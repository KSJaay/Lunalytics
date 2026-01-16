// friendlyName: friendly name for HomeAssistant webhook
// messageType: type of message for HomeAssistant webhook (basic, pretty, nerdy)
// token: url for HomeAssistant webhook (Needs to be a http or https url)

import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const homeAssistantUrlRegex = /^.+$/;
const homeAssistantNotificationServiceRegex = /^.+$/;
const tokenRegex = /^.+$/;

export interface HomeAssistantData {
  homeAssistantUrl: string;
  homeAssistantNotificationService: string;
  [key: string]: any;
}

export interface HomeAssistantInput {
  friendlyName: string;
  messageType: string;
  token: string;
  data: HomeAssistantData;
}

export interface HomeAssistantOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: HomeAssistantData;
}

const HomeAssistant = ({
  friendlyName,
  messageType,
  token,
  data,
}: HomeAssistantInput): HomeAssistantOutput => {
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (
    !data.homeAssistantUrl ||
    !homeAssistantUrlRegex.test(data.homeAssistantUrl)
  ) {
    throw new NotificationValidatorError(
      'homeAssistantUrl',
      'Invalid HomeAssistant URL'
    );
  }

  if (
    !data.homeAssistantNotificationService ||
    !homeAssistantNotificationServiceRegex.test(
      data.homeAssistantNotificationService
    )
  ) {
    throw new NotificationValidatorError(
      'homeAssistantNotificationService',
      'Invalid HomeAssistant Notification Service'
    );
  }

  if (!token || !tokenRegex.test(token)) {
    throw new NotificationValidatorError('token', 'Invalid Access Token');
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  return {
    platform: 'HomeAssistant',
    messageType,
    token,
    friendlyName,
    data,
  };
};

export default HomeAssistant;
