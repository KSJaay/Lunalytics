/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// --- MOCKS ---
jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));

// --- IMPORTS ---
// Import the mocked library functions so we can control their return values
import { hashSync, compareSync } from 'bcryptjs';

// Import your utility functions (adjust path as needed)
import { generateHash, verifyPassword } from '../../../server/utils/hashPassword.js';

describe('Password Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateHash', () => {
    it('should hash the password using 10 salt rounds', () => {
      const plainPassword = 'mySuperSecretPassword';
      const mockHashedValue = '$2a$10$fakehashedvalue...';

      // Mock bcrypt returning a hash
      hashSync.mockReturnValue(mockHashedValue);

      const result = generateHash(plainPassword);

      // Verify bcrypt was called with the password and exactly 10 salt rounds
      expect(hashSync).toHaveBeenCalledWith(plainPassword, 10);
      
      // Verify it returns the result from bcrypt
      expect(result).toBe(mockHashedValue);
    });
  });

  describe('verifyPassword', () => {
    it('should return true if compareSync returns true', () => {
      const password = 'password123';
      const hash = '$2a$10$somehash';

      compareSync.mockReturnValue(true);

      const isValid = verifyPassword(password, hash);

      expect(compareSync).toHaveBeenCalledWith(password, hash);
      expect(isValid).toBe(true);
    });

    it('should return false if compareSync returns false', () => {
      const password = 'wrongPassword';
      const hash = '$2a$10$somehash';

      compareSync.mockReturnValue(false);

      const isValid = verifyPassword(password, hash);

      expect(compareSync).toHaveBeenCalledWith(password, hash);
      expect(isValid).toBe(false);
    });
  });
});