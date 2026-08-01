// chatId: chat id for telegram webhook
// disableNotification: disable notification for telegram webhook (boolean)
// friendlyName: friendly name for telegram webhook
// message: type of message for telegram webhook (basic, pretty, nerdy)
// protectContent: protect content for telegram webhook (boolean)
// token: url for telegram webhook

import * as zod from 'zod';
import { checkNotificationWithZod } from '../zod.js';

const chatIdRegex = /^-?[0-9]+$/;
const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const tokenRegex = /^[0-9]+:[a-zA-Z0-9_-]{1,35}$/;

export interface TelegramData {
  chatId?: string;
  disableNotification?: boolean;
  protectContent?: boolean;
  username?: string;
}

export interface TelegramInput {
  friendlyName: string;
  messageType: string;
  token: string;
  data?: TelegramData;
}

export interface TelegramOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: TelegramData;
}

// const Telegram = ({
//   friendlyName,
//   messageType,
//   token,
//   data = {},
// }: TelegramInput): TelegramOutput => {
//   const {
//     chatId,
//     disableNotification = false,
//     protectContent = false,
//     username,
//   } = data;
//   if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
//     throw new NotificationValidatorError(
//       'friendlyName',
//       'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
//     );
//   }

//   if (chatId && !chatIdRegex.test(chatId)) {
//     throw new NotificationValidatorError('chatId', 'Invalid Chat ID');
//   }

//   if (typeof disableNotification !== 'boolean') {
//     throw new NotificationValidatorError(
//       'disableNotification',
//       'Invalid Disable Notification'
//     );
//   }

//   if (!messageTypes.includes(messageType)) {
//     throw new NotificationValidatorError('messageType', 'Invalid Message Type');
//   }

//   if (typeof protectContent !== 'boolean') {
//     throw new NotificationValidatorError(
//       'protectContent',
//       'Invalid Protect Content'
//     );
//   }

//   if (!tokenRegex.test(token)) {
//     throw new NotificationValidatorError('token', 'Invalid Telegram Bot Token');
//   }

//   return {
//     platform: 'Telegram',
//     messageType,
//     token,
//     friendlyName,
//     data: {
//       chatId,
//       disableNotification,
//       protectContent,
//       username,
//     },
//   };
// };

const zodTelegram = zod
  .object({
    friendlyName: zod
      .string({ error: 'common.error.missingFriendlyNameTelegram' })
      .regex(friendlyNameRegex, {
        message: 'common.error.invalidFriendlyNameTelegram',
      }),
    messageType: zod
      .string({ error: 'common.error.missingMessageType' })
      .refine((val) => messageTypes.includes(val), {
        message: 'common.error.invalidMessageType',
      }),
    token: zod
      .string({ error: 'common.error.missingTelegramBotToken' })
      .regex(tokenRegex, {
        message: 'common.error.invalidTelegramBotToken',
      }),
    data: zod
      .object({
        chatId: zod
          .string()
          .regex(chatIdRegex, {
            message: 'common.error.invalidChatId',
          })
          .optional(),
        disableNotification: zod.boolean().optional(),
        protectContent: zod.boolean().optional(),
        username: zod.string().optional(),
      })
      .optional(),
  })
  .transform((val) => ({
    platform: 'Telegram',
    ...val,
  }));

const Telegram = (input: TelegramInput): TelegramOutput =>
  checkNotificationWithZod(zodTelegram, input);

export default Telegram;
