import { describe, it, expect } from 'vitest';

import {
  generateHash,
  verifyPassword,
} from '../../../server/utils/hashPassword.js';

describe('server/utils/hashPassword', () => {
  describe('generateHash', () => {
    it('returns a non-empty hash that is not the plaintext', () => {
      const hash = generateHash('Password!123');
      expect(hash).toBeTypeOf('string');
      expect(hash.length).toBeGreaterThan(0);
      expect(hash).not.toBe('Password!123');
    });

    it('produces a different hash on each call (random salt)', () => {
      const a = generateHash('same-password');
      const b = generateHash('same-password');
      expect(a).not.toBe(b);
    });
  });

  describe('verifyPassword', () => {
    it('returns true when password matches its hash', () => {
      const hash = generateHash('correct horse battery staple');
      expect(verifyPassword('correct horse battery staple', hash)).toBe(true);
    });

    it('returns false when password does not match', () => {
      const hash = generateHash('correct');
      expect(verifyPassword('wrong', hash)).toBe(false);
    });

    it('returns false for an empty password against a real hash', () => {
      const hash = generateHash('something');
      expect(verifyPassword('', hash)).toBe(false);
    });
  });
});
