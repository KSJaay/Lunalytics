import { describe, it, expect } from 'vitest';

import { msToTime, timeToMs, stringToMs } from '../../../shared/utils/ms.js';

describe('shared/utils/ms', () => {
  describe('timeToMs', () => {
    it('converts seconds → ms', () => {
      expect(timeToMs(2, 'seconds')).toBe(2000);
    });

    it('converts minutes → ms', () => {
      expect(timeToMs(2, 'minutes')).toBe(120_000);
    });

    it('converts hours (default) → ms', () => {
      expect(timeToMs(1)).toBe(3_600_000);
      expect(timeToMs(3, 'hours')).toBe(10_800_000);
    });

    it('converts days → ms', () => {
      expect(timeToMs(1, 'days')).toBe(86_400_000);
    });

    it('converts months (30-day approximation) → ms', () => {
      expect(timeToMs(1, 'months')).toBe(2_592_000_000);
    });
  });

  describe('msToTime', () => {
    it('returns highest non-zero unit (singular vs plural)', () => {
      expect(msToTime(1000)).toBe('1 second');
      expect(msToTime(2000)).toBe('2 seconds');
      expect(msToTime(60_000)).toBe('1 minute');
      expect(msToTime(3_600_000)).toBe('1 hour');
      expect(msToTime(86_400_000)).toBe('1 day');
    });

    it('returns "Unknown" for sub-second durations', () => {
      expect(msToTime(0)).toBe('Unknown');
      expect(msToTime(500)).toBe('Unknown');
    });
  });

  describe('stringToMs', () => {
    it.each([
      ['10s', 0],
      ['5m', 5 * 30 * 86_400_000],
      ['2h', 2 * 3_600_000],
      ['7d', 7 * 86_400_000],
      ['1w', 7 * 86_400_000],
      ['1y', 31_557_600_000],
    ])('parses %s', (input, expected) => {
      expect(stringToMs(input)).toBe(expected);
    });

    it('returns 0 for malformed input', () => {
      expect(stringToMs('abc')).toBe(0);
      expect(stringToMs('')).toBe(0);
      expect(stringToMs('12')).toBe(0);
    });
  });
});
