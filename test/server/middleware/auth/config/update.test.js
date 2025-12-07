/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---
// Must be defined before imports to prevent config.js logger crash

// Mock Shared Validator (Default Export)
jest.mock('../../../../../shared/validators/config.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Database
jest.mock('../../../../../server/database/queries/provider.js', () => ({
  fetchProviders: jest.fn(),
}));

// Mock Config Utility
jest.mock('../../../../../server/utils/config.js', () => ({
  __esModule: true,
  default: {
    set: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock Error Handler
jest.mock('../../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import ConfigValidator from '../../../../../shared/validators/config.js';
import { fetchProviders } from '../../../../../server/database/queries/provider.js';
import updateConfigMiddleware from '../../../../../server/middleware/auth/config/update.js';

describe('updateConfigMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { nativeSignin: true, register: true };
    
    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.json = jest.fn().mockReturnThis();

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should return 400 if ConfigValidator returns string error', async () => {
    ConfigValidator.mockReturnValue('error');

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ error: 'error' });
  });

  it('should return 400 if nativeSignin is false and SSO not enabled', async () => {
    // 1. Validator returns valid object requesting nativeSignin disable
    ConfigValidator.mockReturnValue({ nativeSignin: false });
    
    // 2. Database returns providers that are disabled
    fetchProviders.mockResolvedValue([{ enabled: false }]);

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error:
        'SSO is not enabled, please enable that before turning off native signin',
    });
  });

  it('should set config and return success if valid', async () => {
    // Validator returns valid config updates
    ConfigValidator.mockReturnValue({ nativeSignin: true, register: true });

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    // Verify config.set was called for both keys
    expect(config.set).toHaveBeenCalledWith('nativeSignin', true);
    expect(config.set).toHaveBeenCalledWith('register', true);
    
    expect(fakeResponse.json).toHaveBeenCalledWith({ success: true });
  });

  it('should handle errors gracefully', async () => {
    // Force error in Validator
    ConfigValidator.mockImplementation(() => {
      throw new Error('fail');
    });

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});