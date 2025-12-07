/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import axios from 'axios';
import logger from '../../../server/utils/logger.js';
import { startVersionCheck, getVersionInfo } from '../../../server/utils/checkVersion.js';

// --- MOCKS ---
jest.mock('axios');

// Mock Logger
jest.mock('../../../server/utils/logger.js', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Version Check Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper to wait for the async void function inside startVersionCheck to finish
  const waitForAsync = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  };

  it('should initialize with default values', () => {
    const info = getVersionInfo();
    
    // We expect basic structure. Current version depends on env, so we match object structure.
    expect(info).toEqual(expect.objectContaining({
      latest: null,
      updateAvailable: false,
    }));
  });

  it('should detect an update when latest version is definitely newer', async () => {
    // Mock API to return a version guaranteed to be higher than current (9999.9.9)
    axios.get.mockResolvedValue({
      data: { latest: '9999.9.9' },
    });

    startVersionCheck();
    
    // Wait for internal async check to finish
    await waitForAsync();

    expect(logger.info).toHaveBeenCalledWith('Fetching the latest version');

    const info = getVersionInfo();
    expect(info).toEqual(expect.objectContaining({
      latest: '9999.9.9',
      updateAvailable: true,
    }));
  });

  it('should NOT detect an update when latest version is older', async () => {
    // Mock API to return a version guaranteed to be lower (0.0.0)
    axios.get.mockResolvedValue({
      data: { latest: '0.0.0' },
    });

    startVersionCheck();
    await waitForAsync();

    const info = getVersionInfo();
    expect(info.latest).toBe('0.0.0');
    expect(info.updateAvailable).toBe(false);
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValue(error);

    startVersionCheck();
    await waitForAsync();

    expect(logger.error).toHaveBeenCalledWith('Failed to check for new versions', {
      message: error.message,
      stack: error.stack,
    });
  });

  it('should set an interval to check every hour', async () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    axios.get.mockResolvedValue({ data: { latest: '0.0.0' } });

    startVersionCheck();
    await waitForAsync();

    // Check if setInterval was called with 1 hour (3600000 ms)
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 3600000);
  });
});