import * as zod from 'zod';
import { NotificationValidatorError } from '../../utils/errors.js';
import { checkNotificationWithZod, checkWithZod } from '../zod.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];

export interface AppriseInput {
  messageType: string;
  friendlyName: string;
  token: string;
  data?: {
    urls?: string;
  };
}

export interface AppriseOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: {
    urls: string;
  };
}

// const Apprise = ({
//   messageType,
//   friendlyName,
//   token,
//   data = {},
// }: AppriseInput): AppriseOutput => {
//   const { urls } = data;
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
//     throw new NotificationValidatorError(
//       'token',
//       'Invalid Apprise Webhook URL'
//     );
//   }

//   if (!urls) {
//     throw new NotificationValidatorError('urls', 'Invalid Apprise URLs');
//   }

//   return {
//     platform: 'Apprise',
//     messageType,
//     token,
//     friendlyName,
//     data: {
//       urls,
//     },
//   };
// };

const zodApprise = zod
  .object({
    messageType: zod.string().refine((value) => messageTypes.includes(value), {
      message: 'common.error.invalidMessageType',
    }),
    friendlyName: zod.string().regex(friendlyNameRegex, {
      message: 'common.error.invalidFriendlyName',
    }),
    token: zod.string().min(1, 'common.error.invalidAppriseWebhookURL'),
    data: zod.object({
      urls: zod.string().min(1, 'common.error.invalidAppriseURLs'),
    }),
  })
  .transform((value) => ({
    platform: 'Apprise',
    ...value,
  }));

const Apprise = ({
  messageType,
  friendlyName,
  token,
  data = {},
}: AppriseInput) =>
  checkNotificationWithZod(zodApprise, {
    messageType,
    friendlyName,
    token,
    data,
  });

export default Apprise;
