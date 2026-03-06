// friendlyName: Friendly name for the notification
// messageType: Type of message to send (basic, pretty, nerdy)
// token: Pushover API token
// data.userKey: Pushover user key
// data.device: Device id to send notification to
// data.messageTtl: How long the notification should live before being deleted
// data.priority: Priority level for the notification (-2, -1, 0, 1, 2)

import * as zod from 'zod';
import { checkNotificationWithZod } from '../zod.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];

export interface PushoverData {
  device?: string;
  userKey?: string;
  priority?: string;
  ttl?: string;
}

export interface PushoverInput {
  friendlyName: string;
  messageType: string;
  token: string;
  data: PushoverData;
}

export interface PushoverOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: {
    device?: string;
    userKey: string;
    priority?: number;
    ttl?: number;
  };
}

// const Pushover = ({
//   friendlyName,
//   messageType,
//   token,
//   data,
// }: PushoverInput): PushoverOutput => {
//   if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
//     throw new NotificationValidatorError(
//       'friendlyName',
//       'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
//     );
//   }

//   if (!messageTypes.includes(messageType)) {
//     throw new NotificationValidatorError('messageType', 'Invalid Message Type');
//   }

//   if (!token) {
//     throw new NotificationValidatorError('token', 'Invalid Pushover API Token');
//   }

//   if (!data?.userKey) {
//     throw new NotificationValidatorError(
//       'userKey',
//       'Invalid Pushover User Key'
//     );
//   }

//   if (data?.ttl && !/^\d+$/.test(data.ttl)) {
//     throw new NotificationValidatorError(
//       'ttl',
//       "Invalid Message TTL. Make sure it's a number"
//     );
//   }

//   if (data?.priority) {
//     const priorityAsInt = parseInt(data.priority);

//     if (priorityAsInt < -2 || priorityAsInt > 2) {
//       throw new NotificationValidatorError(
//         'priority',
//         'Invalid Pushover Priority. Must be -2, -1, 0, 1, or 2.'
//       );
//     }
//   }

//   return {
//     platform: 'Pushover',
//     messageType,
//     token,
//     friendlyName,
//     data: {
//       device: data.device,
//       userKey: data.userKey,
//       priority: data.priority ? parseInt(data.priority) : undefined,
//       ttl: data.ttl ? parseInt(data.ttl) : undefined,
//     },
//   };
// };

const zodPushover = zod
  .object({
    friendlyName: zod.string().regex(friendlyNameRegex, {
      message: 'common.error.invalidFriendlyNamePushover',
    }),
    messageType: zod.string().refine((val) => messageTypes.includes(val), {
      message: 'common.error.invalidMessageType',
    }),
    token: zod.string().min(1, {
      message: 'common.error.invalidPushoverApiToken',
    }),
    data: zod.object({
      userKey: zod.string().min(1, {
        message: 'common.error.invalidPushoverUserKey',
      }),
      device: zod.string().optional(),
      priority: zod
        .string()
        .refine((val) => val === undefined || /^-2|-1|0|1|2$/.test(val), {
          message:
            'common.error.invalidPushoverPriority' /* Invalid Pushover Priority. Must be -2, -1 0, 1, or 2. */,
        })
        .optional(),
      ttl: zod
        .string()
        .refine((val) => val === undefined || /^\d+$/.test(val), {
          message:
            'common.error.invalidPushoverTtl' /* Invalid Message TTL. Make sure it's a number. */,
        })
        .optional(),
    }),
  })
  .transform((input) => ({
    platform: 'Pushover',
    ...input,
    data: {
      ...input.data,
      priority: input.data.priority ? parseInt(input.data.priority) : undefined,
      ttl: input.data.ttl ? parseInt(input.data.ttl) : undefined,
    },
  }));

const Pushover = (input: PushoverInput): PushoverOutput =>
  checkNotificationWithZod(input, zodPushover);

export default Pushover;
