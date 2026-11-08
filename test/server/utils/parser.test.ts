import { describe, it, expect } from 'vitest';

import { parseJsonOrArray } from '../../../server/utils/parser.js';

describe('server/utils/parser', () => {
  describe('parseJsonOrArray', () => {
    it('parses a JSON string into an object', () => {
      expect(parseJsonOrArray('{"a":1}')).toEqual({ a: 1 });
    });

    it('returns the failedResponse for an empty string', () => {
      expect(parseJsonOrArray('')).toEqual({});
      expect(parseJsonOrArray('', [])).toEqual([]);
    });

    it('returns the failedResponse for invalid JSON', () => {
      expect(parseJsonOrArray('not-json')).toEqual({});
      expect(parseJsonOrArray('{', [])).toEqual([]);
    });

    it('passes through an object input unchanged', () => {
      const input: any = { hello: 'world' };
      expect(parseJsonOrArray(input)).toBe(input);
    });

    it('returns failedResponse when input is an array (object form)', () => {
      expect(parseJsonOrArray([1, 2, 3] as any)).toEqual({});
    });

    it('parses a JSON array string into an array', () => {
      expect(parseJsonOrArray('[1,2,3]')).toEqual([1, 2, 3]);
    });

    it('returns failedResponse for null/undefined', () => {
      expect(parseJsonOrArray(null as any)).toEqual({});
      expect(parseJsonOrArray(undefined as any)).toEqual({});
    });
  });
});
