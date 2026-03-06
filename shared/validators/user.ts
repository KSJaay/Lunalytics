import * as zod from 'zod';
import { checkWithZod } from './zod.js';

const defaultAvatars = [
  'Ape',
  'Bear',
  'Cat',
  'Dog',
  'Doggo',
  'Duck',
  'Eagle',
  'Fox',
  'Gerbil',
  'Hamster',
  'Hedgehog',
  'Koala',
  'Ostrich',
  'Panda',
  'Rabbit',
  'Rocket',
  'Tiger',
];

// const isImageUrl = (url: string): boolean => {
//   if (typeof url !== 'string') {
//     return false;
//   }
//   return !!url.match(/^https?:\/\//gim);
// };

// const isAvatar = (avatar: string | null): string | false => {
//   if (avatar === null) {
//     return false;
//   }
//   if (!defaultAvatars.includes(avatar) && !isImageUrl(avatar)) {
//     return 'Avatar must be a valid image URL or one of the default avatars.';
//   }
//   return false;
// };

// Is URL or one of the default avatars
const isAvatarValidator = zod.union([
  zod.url().refine((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, 'common.error.invalidAvatarUrl'),
  zod.enum(defaultAvatars),
]);

const isAvatar = (avatar: string | null): string | false =>
  checkWithZod(isAvatarValidator, avatar);

export { isAvatar };
