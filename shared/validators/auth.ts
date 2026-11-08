import * as zod from 'zod';
import { checkWithZod } from './zod.js';

// regex to check user has only letters, numbers, underscore, dash, spaces and should be 3-24 characters long
const usernameRegex = /^[a-zA-Z0-9_\- ]{3,32}$/;
// regex to check if email is valid
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,254}$/;
// regex to check if one letter, one number or special character, atleast 8 characters long and max of 48 characters long
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*~_\-+=]).{8,48}$/;

// const email = zod
//   .string()
//   .min(3, 'Email must be at least 3 characters long.')
//   .max(254, 'Email must be at most 254 characters long.')
//   .regex(emailRegex, 'Email is not valid.');

// const username = zod
//   .string()
//   .min(3, 'Username must be at least 3 characters long.')
//   .max(32, 'Username must be at most 32 characters long.')
//   .regex(
//     usernameRegex,
//     'Username can only contain letters, numbers, underscores, dashes and spaces.'
//   );

// const password = zod
//   .string()
//   .min(8, 'Password must be at least 8 characters long.')
//   .max(48, 'Password must be at most 48 characters long.')
//   .regex(
//     passwordRegex,
//     'Password must contain at least one letter and one number or special character.'
//   );

const zodEmail = zod
  .string()
  .min(3, 'common.error.emailTooShort')
  .max(254, 'common.error.emailTooLong')
  .regex(emailRegex, 'common.error.emailInvalid');

const email = (email?: string) => checkWithZod(zodEmail, email);

const zodUsername = zod
  .string()
  .min(3, 'common.error.usernameTooShort')
  .max(32, 'common.error.usernameTooLong')
  .regex(usernameRegex, 'common.error.usernameInvalid');

const username = (username?: string) => checkWithZod(zodUsername, username);

const zodPassword = zod
  .string()
  .min(8, 'common.error.passwordTooShort')
  .max(48, 'common.error.passwordTooLong')
  .regex(passwordRegex, 'common.error.passwordInvalid');

const password = (password?: string) => checkWithZod(zodPassword, password);

const auth = { email, username, password };

export default auth;
