/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// --- MOCKS ---
jest.mock('axios');
jest.mock('../../../server/utils/logger.js', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Icons Utility', () => {
  let axios;
  let logger;
  let iconsModule;
  const ICONS_URL = 'https://raw.githubusercontent.com/selfhst/cdn/refs/heads/main/directory/icons.json';

  // Helper to load a fresh instance of the module
  const reloadModule = async () => {
    jest.resetModules(); // Clears variables like 'let icons = []'
    axios = (await import('axios')).default;
    logger = (await import('../../../server/utils/logger.js')).default;
    iconsModule = await import('../../../server/utils/icons.js'); // Adjust path to your file
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    await reloadModule();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with empty icons and undefined lastFetched', () => {
    const { icons, lastFetched } = iconsModule.getIcons();
    expect(icons).toEqual([]);
    expect(lastFetched).toBeUndefined();
  });

  it('should fetch and process SVG icons correctly', async () => {
    // Mock API Data
    const mockData = [
      { Name: 'TestIcon', Reference: 'test-icon', SVG: 'Yes', PNG: 'No', WebP: 'No' }
    ];
    axios.get.mockResolvedValue({ data: mockData });

    // Execute
    await iconsModule.loadIcons();

    // Verify Axios Call
    expect(axios.get).toHaveBeenCalledWith(ICONS_URL);

    // Verify State Update
    const { icons, lastFetched } = iconsModule.getIcons();
    
    expect(icons).toHaveLength(1);
    expect(icons[0]).toEqual({
      n: 'TestIcon',
      u: 'test-icon',
      f: 'svg', // Should detect SVG
    });
    
    expect(lastFetched).toBeDefined();
    expect(logger.info).toHaveBeenCalledWith('Icons have been loaded successfully!');
  });

  it('should prioritize formats correctly (SVG > PNG > WebP)', async () => {
    const mockData = [
      // Case 1: Has PNG, No SVG
      { Name: 'PngIcon', Reference: 'png-ref', SVG: 'No', PNG: 'Yes', WebP: 'Yes' },
      // Case 2: Has Only WebP
      { Name: 'WebpIcon', Reference: 'webp-ref', SVG: 'No', PNG: 'No', WebP: 'Yes' },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    await iconsModule.loadIcons();

    const { icons } = iconsModule.getIcons();

    expect(icons).toEqual([
      { n: 'PngIcon', u: 'png-ref', f: 'png' },   // PNG logic check
      { n: 'WebpIcon', u: 'webp-ref', f: 'webp' } // WebP logic check
    ]);
  });

  it('should filter out items with no valid format', async () => {
    const mockData = [
      { Name: 'Valid', Reference: 'valid', SVG: 'Yes', PNG: 'No', WebP: 'No' },
      { Name: 'Invalid', Reference: 'invalid', SVG: 'No', PNG: 'No', WebP: 'No' }, // All No
      { Name: 'MissingProps', Reference: 'missing' } // Missing keys
    ];
    axios.get.mockResolvedValue({ data: mockData });

    await iconsModule.loadIcons();

    const { icons } = iconsModule.getIcons();

    // Should only have the 1 valid icon
    expect(icons).toHaveLength(1);
    expect(icons[0].n).toBe('Valid');
  });

  it('should NOT update icons if API returns empty array', async () => {
    // 1. Load some initial icons
    axios.get.mockResolvedValueOnce({ 
      data: [{ Name: 'Old', Reference: 'old', SVG: 'Yes' }] 
    });
    await iconsModule.loadIcons();
    
    // Verify initial state
    expect(iconsModule.getIcons().icons).toHaveLength(1);

    // 2. Second call returns empty array
    axios.get.mockResolvedValueOnce({ data: [] });
    await iconsModule.loadIcons();

    // 3. Verify icons are NOT overwritten by empty array
    // (The code: if (formattedIcons.length) { icons = ... })
    const { icons } = iconsModule.getIcons();
    expect(icons).toHaveLength(1);
    expect(icons[0].n).toBe('Old');
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValue(error);

    await iconsModule.loadIcons();

    expect(logger.error).toHaveBeenCalledWith('Error loading icons', {
      error: 'Network Error',
    });

    // Icons should remain empty
    const { icons } = iconsModule.getIcons();
    expect(icons).toEqual([]);
  });

  it('should handle malformed API response (not an array)', async () => {
    axios.get.mockResolvedValue({ data: "Im not an array" });

    await iconsModule.loadIcons();

    // Should simply not update anything, effectively safe failure
    const { icons } = iconsModule.getIcons();
    expect(icons).toEqual([]);
  });
});