/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// --- MOCKS ---
// Mock the external library so we can force specific device types
jest.mock('ua-parser-js', () => ({
  UAParser: jest.fn(),
}));

// --- IMPORTS ---
import { UAParser } from 'ua-parser-js';
import { parseUserAgent } from '../../../server/utils/uaParser.js'; // Adjust path

describe('User Agent Parser Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should detect Mobile devices', () => {
    // Mock UAParser to return mobile data
    UAParser.mockReturnValue({
      browser: { name: 'Chrome Mobile' },
      device: { type: 'mobile', model: 'Pixel' },
      os: { name: 'Android' },
    });

    const result = parseUserAgent('dummy-mobile-agent');

    expect(UAParser).toHaveBeenCalledWith('dummy-mobile-agent');
    
    // Check structured output
    expect(result.device).toEqual({
      os: 'Android',
      browser: 'Chrome Mobile',
      type: 'mobile',
    });

    // Check raw data pass-through
    expect(result.data.device.model).toBe('Pixel');
  });

  it('should detect Tablet devices', () => {
    // Mock UAParser to return tablet data
    UAParser.mockReturnValue({
      browser: { name: 'Safari' },
      device: { type: 'tablet', model: 'iPad' },
      os: { name: 'iOS' },
    });

    const result = parseUserAgent('dummy-tablet-agent');

    expect(result.device).toEqual({
      os: 'iOS',
      browser: 'Safari',
      type: 'tablet',
    });
  });

  it('should default to Desktop for undefined device types', () => {
    // UAParser usually returns undefined type for desktops
    UAParser.mockReturnValue({
      browser: { name: 'Firefox' },
      device: { type: undefined }, 
      os: { name: 'Windows' },
    });

    const result = parseUserAgent('dummy-desktop-agent');

    expect(result.device).toEqual({
      os: 'Windows',
      browser: 'Firefox',
      type: 'desktop',
    });
  });

  it('should handle missing OS and Browser names (Unknown)', () => {
    // Mock empty return values
    UAParser.mockReturnValue({
      browser: {}, // No name
      device: { type: 'mobile' },
      os: {}, // No name
    });

    const result = parseUserAgent('weird-agent');

    expect(result.device).toEqual({
      os: 'Unknown',
      browser: 'Unknown',
      type: 'mobile',
    });
  });

  it('should handle completely empty parser results (Safety check)', () => {
    // Even if UAParser returns empty objects, your code destructures them.
    // We simulate the minimal object structure needed to avoid crashing.
    UAParser.mockReturnValue({
      browser: {},
      device: {},
      os: {},
    });

    const result = parseUserAgent('empty-agent');

    expect(result.device).toEqual({
      os: 'Unknown',
      browser: 'Unknown',
      type: 'desktop', // Fallback
    });
  });
});