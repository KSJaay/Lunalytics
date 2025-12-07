/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---
// Must be defined before imports to prevent config.js logger crash

jest.mock('../../../../../server/database/queries/provider.js', () => ({
  fetchProviders: jest.fn(),
}));

jest.mock('../../../../../server/utils/config.js', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchProviders } from '../../../../../server/database/queries/provider.js';
import getConfigMiddleware from '../../../../../server/middleware/auth/config/getConfig.js';

describe('getConfigMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    
    // Setup Spy
    fakeResponse.json = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should return nativeSignin true and sso false if no providers', async () => {
    // Mock empty providers
    fetchProviders.mockResolvedValue([]);

    // Mock config.get for 'register' call
    config.get.mockReturnValue(true);

    await getConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.json).toHaveBeenCalledWith({
      nativeSignin: true,
      register: true,
      sso: false,
      providers: [],
    });
  });

  it('should return sso true and nativeSignin from config if SSO enabled', async () => {
    // Mock active provider
    fetchProviders.mockResolvedValue([{ provider: 'google', enabled: true }]);

    // Mock config.get implementation to handle different keys
    config.get.mockImplementation((key) => {
      if (key === 'nativeSignin') return false;
      if (key === 'register') return true;
      return true;
    });

    await getConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.json).toHaveBeenCalledWith({
      nativeSignin: false,
      register: true,
      sso: true,
      providers: ['google'],
    });
  });

  it('should handle errors gracefully', async () => {
    // Force error
    fetchProviders.mockRejectedValue(new Error('fail'));

    await getConfigMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});