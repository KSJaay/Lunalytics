/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { parseJsonOrArray } from '../../../server/utils/parser.js'; // Adjust path to where this file is located

describe('parseJsonOrArray Utility', () => {
  describe('String Inputs', () => {
    it('should parse a valid JSON object string', () => {
      const input = '{"key": "value", "num": 123}';
      const result = parseJsonOrArray(input);
      expect(result).toEqual({ key: 'value', num: 123 });
    });

    it('should parse a valid JSON array string', () => {
      // Source code allows stringified arrays via JSON.parse
      const input = '[1, 2, "three"]';
      const result = parseJsonOrArray(input);
      expect(result).toEqual([1, 2, "three"]);
    });

    it('should return default failedResponse ({}) for invalid JSON string', () => {
      const input = '{ invalid_json: ';
      const result = parseJsonOrArray(input);
      expect(result).toEqual({});
    });

    it('should return custom failedResponse for invalid JSON string', () => {
      const input = 'bad json';
      const fallback = [];
      const result = parseJsonOrArray(input, fallback);
      expect(result).toBe(fallback);
    });
  });

  describe('Object Inputs', () => {
    it('should return the object as-is if it is a plain object', () => {
      const input = { foo: 'bar' };
      const result = parseJsonOrArray(input);
      expect(result).toBe(input); // Should return exact reference
    });

    it('should return failedResponse if input is an Array', () => {
      // Logic check: source code says "if (Array.isArray(str)) return failedResponse;"
      const input = ['a', 'b'];
      const result = parseJsonOrArray(input);
      expect(result).toEqual({});
    });

    it('should return custom failedResponse if input is an Array', () => {
      const input = [1, 2];
      const fallback = 'error';
      const result = parseJsonOrArray(input, fallback);
      expect(result).toBe('error');
    });
  });

  describe('Edge Cases', () => {
    it('should return failedResponse for null', () => {
      const result = parseJsonOrArray(null);
      expect(result).toEqual({});
    });

    it('should return failedResponse for undefined', () => {
      const result = parseJsonOrArray(undefined);
      expect(result).toEqual({});
    });

    it('should return failedResponse for empty string', () => {
      const result = parseJsonOrArray('');
      expect(result).toEqual({});
    });

    it('should return failedResponse for non-string/non-object primitives (e.g. number)', () => {
      // typeof 123 is 'number', loops through logic and hits final return failedResponse
      const result = parseJsonOrArray(123);
      expect(result).toEqual({});
    });
  });
});