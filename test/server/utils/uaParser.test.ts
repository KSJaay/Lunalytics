import { describe, it, expect } from 'vitest';

import { parseUserAgent } from '../../../server/utils/uaParser.js';

describe('server/utils/uaParser', () => {
  describe('parseUserAgent', () => {
    it('classifies a desktop Chrome UA as desktop', () => {
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const { device } = parseUserAgent(ua);
      expect(device.type).toBe('desktop');
      expect(device.browser).toBe('Chrome');
      expect(device.os).toBe('macOS');
    });

    it('classifies an iPhone UA as mobile', () => {
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
        '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
      const { device } = parseUserAgent(ua);
      expect(device.type).toBe('mobile');
      expect(device.os).toBe('iOS');
    });

    it('classifies an iPad UA as tablet', () => {
      const ua =
        'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
        '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
      const { device } = parseUserAgent(ua);
      expect(device.type).toBe('tablet');
    });

    it('returns "Unknown" for an empty UA string', () => {
      const { device } = parseUserAgent('');
      expect(device.os).toBe('Unknown');
      expect(device.browser).toBe('Unknown');
      expect(device.type).toBe('desktop');
    });

    it('returns "Unknown" when no UA is provided', () => {
      const { device } = parseUserAgent(undefined);
      expect(device.os).toBe('Unknown');
      expect(device.browser).toBe('Unknown');
    });
  });
});
