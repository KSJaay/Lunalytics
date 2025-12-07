/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import axios from 'axios';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---
// Must be defined before imports to prevent config.js logger crash

jest.mock('../../../../../server/database/queries/provider.js', () => ({
  fetchProvider: jest.fn(),
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

jest.mock('axios');

// --- 2. IMPORT FILES ---
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchProvider } from '../../../../../server/database/queries/provider.js';
import twitchCallback from '../../../../../server/middleware/auth/callback/twitch.js';

describe('twitchCallback', () => {
  let fakeRequest, fakeResponse, fakeNext;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { code: 'abc' };
    
    // Setup spies
    fakeResponse.redirect = jest.fn();
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn();
    fakeResponse.locals = {};

    fakeNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should redirect if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await twitchCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=missing_code&provider=twitch'
    );
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await twitchCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=provider_not_found&provider=twitch'
    );
  });

  it('should redirect if user not found (empty data array)', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'twitch',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    
    // Mock Token Exchange
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // Mock User Info (Empty array)
    axios.get.mockResolvedValue({ data: { data: [] } });

    await twitchCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/auth/error?code=unverified_user&provider=twitch'
    );
  });

  it('should set authUser and call next if user found', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'twitch',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // Mock Valid User Info
    axios.get.mockResolvedValue({
      data: {
        data: [
          { email: 'e', display_name: 'd', id: 'i', profile_image_url: 'p' },
        ],
      },
    });

    await twitchCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i',
      email: 'e',
      avatar: 'p',
      username: 'd',
      provider: 'twitch',
    });

    expect(fakeNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    fetchProvider.mockImplementation(() => {
      throw new Error('fail');
    });

    await twitchCallback(fakeRequest, fakeResponse, fakeNext);

    expect(handleError).toHaveBeenCalled();
  });
});