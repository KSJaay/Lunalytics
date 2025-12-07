/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---
// Define these before imports to prevent config.js logger from crashing

jest.mock('../../../../server/utils/config.js', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../shared/utils/authenication.js', () => ({
  getAuthRedirectUrl: jest.fn(),
}));

jest.mock('../../../../server/database/queries/provider.js', () => ({
  fetchProvider: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import config from '../../../../server/utils/config.js';
import { getAuthRedirectUrl } from '../../../../shared/utils/authenication.js';
import { fetchProvider } from '../../../../server/database/queries/provider.js';
import redirectUsingProviderMiddleware from '../../../../server/middleware/auth/platform.js';

describe('redirectUsingProviderMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.params = { provider: 'google' };
    
    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn().mockReturnThis();
    fakeResponse.redirect = jest.fn().mockReturnThis();

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should return 400 if no provider provided', async () => {
    fakeRequest.params.provider = undefined;

    await redirectUsingProviderMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No provider provided');
  });

  it('should return 404 if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await redirectUsingProviderMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.send).toHaveBeenCalledWith(
      'Unable to find SSO for provider'
    );
  });

  it('should redirect to provider URL if provider found', async () => {
    // 1. Mock Database
    fetchProvider.mockResolvedValue({
      provider: 'google',
      clientId: 'abc',
    });

    // 2. Mock Config
    config.get.mockReturnValue('https://site.com');
    
    // 3. Mock Auth Utils
    getAuthRedirectUrl.mockReturnValue('https://auth.url');

    await redirectUsingProviderMiddleware(fakeRequest, fakeResponse);

    expect(getAuthRedirectUrl).toHaveBeenCalledWith(
      'google',
      'abc',
      'https://site.com/api/auth/callback/google'
    );
    expect(fakeResponse.redirect).toHaveBeenCalledWith('https://auth.url');
  });
});