// messageType: type of message for discord webhook (basic, pretty, nerdy)
// friendlyName: friendly name for discord webhook
// token: url for discord webhook
// username: username for discord webhook (optional)

import * as zod from 'zod';
import { checkNotificationWithZod } from '../zod.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const tokenRegex =
  /^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/[0-9]+\/[0-9a-zA-Z_.-]+(\?thread_id=[0-9]+)?$/;
const usernameRegex = /^[a-zA-Z0-9_]{1,32}$/;

export interface DiscordInput {
  messageType: string;
  friendlyName: string;
  token: string;
  data?: {
    textMessage?: string;
    username?: string;
  };
}

export interface DiscordOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: {
    textMessage?: string;
    username?: string;
  };
}

// const Discord = ({
//   messageType,
//   friendlyName,
//   token,
//   data = {},
// }: DiscordInput): DiscordOutput => {
//   const { textMessage, username } = data;
//   if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
//     throw new NotificationValidatorError(
//       'friendlyName',
//       'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
//     );
//   }

//   if (!messageTypes.includes(messageType)) {
//     throw new NotificationValidatorError('messageType', 'Invalid Message Type');
//   }

//   if (!tokenRegex.test(token)) {
//     throw new NotificationValidatorError(
//       'token',
//       'Invalid Discord Webhook URL'
//     );
//   }

//   if (username && !usernameRegex.test(username)) {
//     throw new NotificationValidatorError(
//       'username',
//       'Invalid Discord Webhook Username'
//     );
//   }

//   return {
//     platform: 'Discord',
//     messageType,
//     token,
//     friendlyName,
//     data: {
//       textMessage,
//       username,
//     },
//   };
// };

const zodDiscord = zod
  .object({
    messageType: zod
      .string({ error: 'common.error.missingMessageType' })
      .refine((val) => ['basic', 'pretty', 'nerdy'].includes(val), {
        message: 'common.error.invalidMessageType',
      }),
    friendlyName: zod
      .string({ error: 'common.error.missingFriendlyNameDiscord' })
      .regex(friendlyNameRegex, {
        message: 'common.error.invalidFriendlyNameDiscord',
      }),
    token: zod
      .string({ error: 'common.error.missingDiscordWebhookUrl' })
      .regex(tokenRegex, {
        message: 'common.error.invalidDiscordWebhookUrl',
      }),
    data: zod
      .object({
        textMessage: zod.string().optional(),
        username: zod
          .string()
          .regex(usernameRegex, {
            message: 'common.error.invalidDiscordWebhookUsername',
          })
          .optional(),
      })
      .optional(),
  })
  .transform((input) => ({
    platform: 'Discord',
    ...input,
  }));

const Discord = ({
  messageType,
  friendlyName,
  token,
  data = {},
}: DiscordInput) =>
  checkNotificationWithZod(zodDiscord, {
    messageType,
    friendlyName,
    token,
    data,
  });

export default Discord;
