import * as zod from 'zod';
import { checkNotificationWithZod } from '../zod.js';

const friendlyNameRegex = /^[a-zA-Z0-9_-]+$/;
const messageTypes = ['basic', 'pretty', 'nerdy'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,254}$/;

export interface EmailInput {
  friendlyName: string;
  token: string;
  messageType: string;
  data?: {
    port?: number;
    security?: boolean;
    username?: string;
    password?: string;
    fromEmail?: string;
    toEmail?: string;
    ccEmail?: string;
    bccEmail?: string;
  };
}

export interface EmailOutput {
  platform: string;
  messageType: string;
  token: string;
  friendlyName: string;
  data: {
    port: number;
    security: boolean;
    username: string;
    password: string;
    fromEmail?: string;
    toEmail?: string;
    ccEmail?: string;
    bccEmail?: string;
  };
}

// const Email = ({
//   friendlyName,
//   token,
//   messageType,
//   data = {},
// }: EmailInput): EmailOutput => {
//   const {
//     port = 587,
//     security = true,
//     username,
//     password,
//     fromEmail,
//     toEmail,
//     ccEmail,
//     bccEmail,
//   } = data;

//   if (friendlyNameRegex && !friendlyNameRegex.test(friendlyName)) {
//     throw new NotificationValidatorError(
//       'friendlyName',
//       'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.'
//     );
//   }

//   if (!token) {
//     throw new NotificationValidatorError('token', 'Invalid Email Webhook URL');
//   }

//   if (!messageTypes.includes(messageType)) {
//     throw new NotificationValidatorError('messageType', 'Invalid Message Type');
//   }

//   if (!port) {
//     throw new NotificationValidatorError('port', 'Invalid Port');
//   }

//   if (security === undefined) {
//     throw new NotificationValidatorError(
//       'security',
//       'Invalid Security Setting'
//     );
//   }

//   if (!username) {
//     throw new NotificationValidatorError('username', 'Invalid Username');
//   }

//   if (!password) {
//     throw new NotificationValidatorError('password', 'Invalid Password');
//   }

//   return {
//     platform: 'Email',
//     messageType,
//     token,
//     friendlyName,
//     data: {
//       port,
//       security,
//       username,
//       password,
//       fromEmail,
//       toEmail,
//       ccEmail,
//       bccEmail,
//     },
//   };
// };

const zodEmail = zod
  .object({
    friendlyName: zod.string().regex(friendlyNameRegex, {
      message:
        'Invalid Friendly Name. Must be alphanumeric, dashes, and underscores only.',
    }),
    token: zod.string().min(1, { message: 'Invalid Email Webhook URL' }),
    messageType: zod.enum(messageTypes, {
      message: 'Invalid Message Type',
    }),
    data: zod.object({
      port: zod.number().default(587),
      security: zod.boolean().default(true),
      username: zod.string().min(1, { message: 'Invalid Username' }),
      password: zod.string().min(1, { message: 'Invalid Password' }),
      fromEmail: zod
        .string()
        .min(3, 'common.error.emailTooShort')
        .max(254, 'common.error.emailTooLong')
        .regex(emailRegex, 'common.error.emailInvalid')
        .optional(),
      toEmail: zod
        .string()
        .min(3, 'common.error.emailTooShort')
        .max(254, 'common.error.emailTooLong')
        .regex(emailRegex, 'common.error.emailInvalid')
        .optional(),
      ccEmail: zod
        .string()
        .min(3, 'common.error.emailTooShort')
        .max(254, 'common.error.emailTooLong')
        .regex(emailRegex, 'common.error.emailInvalid')
        .optional(),
      bccEmail: zod
        .string()
        .min(3, 'common.error.emailTooShort')
        .max(254, 'common.error.emailTooLong')
        .regex(emailRegex, 'common.error.emailInvalid')
        .optional(),
    }),
  })
  .transform((value) => ({
    platform: 'Email',
    ...value,
  }));

export const Email = ({
  friendlyName,
  token,
  messageType,
  data = {},
}: EmailInput) =>
  checkNotificationWithZod(zodEmail, {
    friendlyName,
    token,
    messageType,
    data,
  });

export default Email;
