import { PermissionsBits } from './bitFlags.js';

export const isValidBitFlags = (bitFlags) => {
  if (bitFlags === 0) return true;

  const allDefinedBits = Object.values(PermissionsBits).reduce(
    (acc, bit) => acc | bit,
    0
  );
  return (bitFlags & ~allDefinedBits) === 0;
};
