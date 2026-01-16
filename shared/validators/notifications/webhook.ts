// additionalHeaders: additional headers for webhook
// friendlyName: friendly name for webhook
// messageType: type of message for webhook (basic, pretty, nerdy)
// requestType: type of request for webhook (application/json, form-data)
// showAdditionalHeaders: show additional headers for webhook
// token: url for webhook (Needs to be a http or https url)

import { NotificationValidatorError } from '../../utils/errors.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const requestTypes = ['application/json', 'form-data'];
const tokenRegex =
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})+$/;

const isJson = (value: string) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
};

export interface WebhookData {
  additionalHeaders?: string;
  showAdditionalHeaders?: boolean;
  requestType?: string;
}

export interface WebhookInput {
  friendlyName: string;
  messageType: string;
  token: string;
  data?: WebhookData;
}

export interface WebhookOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: {
    additionalHeaders?: string;
    requestType: string;
  };
}

const Webhook = ({
  friendlyName,
  messageType,
  token,
  data = {},
}: WebhookInput): WebhookOutput => {
  const {
    additionalHeaders,
    showAdditionalHeaders = false,
    requestType = 'application/json',
  } = data;
  if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
    throw new NotificationValidatorError(
      'friendlyName',
      'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
    );
  }

  if (showAdditionalHeaders && !isJson(additionalHeaders || '')) {
    throw new NotificationValidatorError(
      'additionalHeaders',
      'Invalid Additional Headers Format'
    );
  }

  if (!messageTypes.includes(messageType)) {
    throw new NotificationValidatorError('messageType', 'Invalid Message Type');
  }

  if (!tokenRegex.test(token)) {
    throw new NotificationValidatorError('token', 'Invalid Webhook URL');
  }

  if (!requestTypes.includes(requestType)) {
    throw new NotificationValidatorError('requestType', 'Invalid Request Type');
  }

  return {
    platform: 'Webhook',
    messageType,
    token,
    friendlyName,
    data: {
      additionalHeaders: showAdditionalHeaders ? additionalHeaders : undefined,
      requestType,
    },
  };
};

export default Webhook;
