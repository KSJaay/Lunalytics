// channel: channel name for slack webhook (e.g. #lunalytics-alerts) (optional)
// friendlyName: friendly name for slack webhook
// message: type of message for discord webhook (basic, pretty, nerdy)
// textMessage: text message for discord webhook (optional)
// token: url for discord webhook
// username: username for discord webhook (optional)

import * as zod from 'zod';
import { checkNotificationWithZod } from '../zod.js';

const channelRegex = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const tokenRegex =
  /^https:\/\/hooks.slack.com\/services\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{1,32}$/;

export interface SlackData {
  channel?: string;
  username?: string;
  textMessage?: string;
}

export interface SlackInput {
  friendlyName: string;
  messageType: string;
  token: string;
  data?: SlackData;
}

export interface SlackOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: SlackData;
}

// const Slack = ({
//   friendlyName,
//   messageType,
//   token,
//   data = {},
// }: SlackInput): SlackOutput => {
//   const { channel, username, textMessage } = data;
//   if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
//     throw new NotificationValidatorError(
//       'friendlyName',
//       'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
//     );
//   }

//   if (channel && !channelRegex.test(channel)) {
//     throw new NotificationValidatorError('channel', 'Invalid Channel Name');
//   }

//   if (!messageTypes.includes(messageType)) {
//     throw new NotificationValidatorError('messageType', 'Invalid Message Type');
//   }

//   if (!tokenRegex.test(token)) {
//     throw new NotificationValidatorError('token', 'Invalid Slack Webhook URL');
//   }

//   if (username && !usernameRegex.test(username)) {
//     throw new NotificationValidatorError(
//       'username',
//       'Invalid Slack Webhook Username'
//     );
//   }

//   return {
//     platform: 'Slack',
//     messageType,
//     token,
//     friendlyName,
//     data: {
//       channel,
//       textMessage,
//       username,
//     },
//   };
// };

const zodSlack = zod
  .object({
    friendlyName: zod
      .string({ error: 'common.error.missingFriendlyNameSlack' })
      .regex(friendlyNameRegex, {
        message: 'common.error.invalidFriendlyNameSlack',
      }),
    messageType: zod
      .string({ error: 'common.error.missingMessageType' })
      .refine((val) => messageTypes.includes(val), {
        message: 'common.error.invalidMessageType',
      }),
    token: zod
      .string({ error: 'common.error.missingSlackWebhookUrl' })
      .regex(tokenRegex, {
        message: 'common.error.invalidSlackWebhookUrl',
      }),
    data: zod
      .object({
        channel: zod
          .string()
          .regex(channelRegex, {
            message: 'common.error.invalidChannelName',
          })
          .optional(),
        username: zod
          .string()
          .regex(usernameRegex, {
            message: 'common.error.invalidSlackWebhookUsername',
          })
          .optional(),
        textMessage: zod.string().optional(),
      })
      .optional(),
  })
  .transform((val) => ({
    platform: 'Slack',
    ...val,
  }));

const Slack = (input: SlackInput): SlackOutput =>
  checkNotificationWithZod(zodSlack, input);

export default Slack;
