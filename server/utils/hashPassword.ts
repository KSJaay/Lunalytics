import { hashSync, compareSync } from 'bcryptjs';
const saltRounds = 10;

/**
 * Hash a password
 * @param {string} password
 * @returns {string}
 */

export const generateHash = (password: string) => {
  return hashSync(password, saltRounds);
};

/**
 * Check if the user password matches the user hash password
 * @param {string} password
 * @param {string} hashPassword
 * @returns {boolean} Returns boolean if password matches
 */

export const verifyPassword = (password: string, hashPassword: string) => {
  return compareSync(password, hashPassword);
};
