/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import axios from 'axios';
import { createRequest, createResponse } from 'node-mocks-http';

// --- MOCKS MUST BE DEFINED BEFORE IMPORTS ---

// 1. Mock Provider Database Query
jest.mock('../../../../../server/database/queries/provider.js', () => ({
  fetchProvider: jest.fn(),
}));

// 2. Mock Config (To prevent Winston Logger crash)
jest.mock('../../../../../server/utils/config.js', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// 3. Mock Error Handler
jest.mock('../../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// 4. Mock Axios
jest.mock('axios');

// --- IMPORTS ---
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchProvider } from '../../../../../server/database/queries/provider.js';
import discordCallback from '../../../../../server/middleware/auth/callback/discord.js';

describe('discordCallback', () => {
  let fakeRequest, fakeResponse, fakeNext;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { code: 'abc' };
    
    // Setup generic spies
    fakeResponse.redirect = jest.fn();
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn();
    fakeResponse.locals = {};

    fakeNext = jest.fn();
    
    // Reset specific mocks to clean state
    fetchProvider.mockReset();
    handleError.mockReset();
    config.get.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=missing_code&provider=discord'
    );
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=provider_not_found&provider=discord'
    );
  });

  it('should redirect if user not verified', async () => {
    // Mock Provider
    fetchProvider.mockResolvedValue({
      provider: 'discord',
      clientId: 'id',
      clientSecret: 'secret',
    });

    // Mock Config
    config.get.mockReturnValue('https://site.com');

    // Mock Axios Post (Token exchange)
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // Mock Axios Get (User Profile) - Return verified: false
    axios.get.mockResolvedValue({
      data: { verified: false, email: null },
    });

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=unverified_user&provider=discord'
    );
  });

  it('should set authUser and call next if user verified', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'discord',
      clientId: 'id',
      clientSecret: 'secret',
    });
    
    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // Return valid user
    axios.get.mockResolvedValue({
      data: { avatar: 'a', id: 'i', username: 'u', email: 'e', verified: true },
    });

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i',
      email: 'e',
      avatar: 'a',
      username: 'u',
      provider: 'discord',
    });
    expect(fakeNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    // Force an error in fetchProvider
    fetchProvider.mockImplementation(() => {
      throw new Error('fail');
    });

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(handleError).toHaveBeenCalled();
  });
});