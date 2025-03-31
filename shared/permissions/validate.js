import { PermissionsBits } from './bitFlags.js';

const isPowerOfTwo = (n) => {
  return n > 0 && (n & (n - 1)) === 0;
};

export const isValidPermission = (permission) => {
  return (
    isPowerOfTwo(permission) &&
    Object.hasOwnProperty.call(PermissionsBits, permission)
  );
};
