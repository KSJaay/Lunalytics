// friendlyName: friendly name for HomeAssistant webhook
// messageType: type of message for HomeAssistant webhook (basic, pretty, nerdy)
// token: url for HomeAssistant webhook (Needs to be a http or https url)

import * as zod from 'zod';
import { checkNotificationWithZod } from '../zod.js';

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

// const HomeAssistant = ({
//   friendlyName,
//   messageType,
//   token,
//   data,
// }: HomeAssistantInput): HomeAssistantOutput => {
//   if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
//     throw new NotificationValidatorError(
//       'friendlyName',
//       'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
//     );
//   }

//   if (
//     !data.homeAssistantUrl ||
//     !homeAssistantUrlRegex.test(data.homeAssistantUrl)
//   ) {
//     throw new NotificationValidatorError(
//       'homeAssistantUrl',
//       'Invalid HomeAssistant URL'
//     );
//   }

//   if (
//     !data.homeAssistantNotificationService ||
//     !homeAssistantNotificationServiceRegex.test(
//       data.homeAssistantNotificationService
//     )
//   ) {
//     throw new NotificationValidatorError(
//       'homeAssistantNotificationService',
//       'Invalid HomeAssistant Notification Service'
//     );
//   }

//   if (!token || !tokenRegex.test(token)) {
//     throw new NotificationValidatorError('token', 'Invalid Access Token');
//   }

//   if (!messageTypes.includes(messageType)) {
//     throw new NotificationValidatorError('messageType', 'Invalid Message Type');
//   }

//   return {
//     platform: 'HomeAssistant',
//     messageType,
//     token,
//     friendlyName,
//     data,
//   };
// };

const zodHomeAssistant = zod
  .object({
    friendlyName: zod
      .string({ error: 'common.error.missingFriendlyNameHomeAssistant' })
      .regex(friendlyNameRegex, {
        message: 'common.error.invalidFriendlyNameHomeAssistant',
      }),
    messageType: zod
      .string({ error: 'common.error.missingMessageType' })
      .refine((val) => messageTypes.includes(val), {
        message: 'common.error.invalidMessageType',
      }),
    token: zod
      .string({ error: 'common.error.missingAccessToken' })
      .regex(tokenRegex, {
        message: 'common.error.invalidAccessToken',
      }),
    data: zod.object({
      homeAssistantUrl: zod
        .string({ error: 'common.error.missingHomeAssistantUrl' })
        .regex(homeAssistantUrlRegex, {
          message: 'common.error.invalidHomeAssistantUrl',
        }),
      homeAssistantNotificationService: zod
        .string({
          error: 'common.error.missingHomeAssistantNotificationService',
        })
        .regex(homeAssistantNotificationServiceRegex, {
          message: 'common.error.invalidHomeAssistantNotificationService',
        }),
    }),
  })
  .transform((value) => ({
    platform: 'HomeAssistant',
    ...value,
  }));

const HomeAssistant = ({
  friendlyName,
  messageType,
  token,
  data,
}: HomeAssistantInput) =>
  checkNotificationWithZod(zodHomeAssistant, {
    friendlyName,
    messageType,
    token,
    data,
  });

export default HomeAssistant;
