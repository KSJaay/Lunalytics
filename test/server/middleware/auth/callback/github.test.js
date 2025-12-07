/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import axios from 'axios';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---
// These must be defined before the actual file imports to stop config.js from crashing.

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
import githubCallback from '../../../../../server/middleware/auth/callback/github.js';

describe('githubCallback', () => {
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

  it('should return 400 if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No code provided');
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/auth/error');
  });

  it('should redirect if not a user (e.g. Bot)', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    
    // 1. Post to get Token
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // 2. Get User Profile (Return Bot)
    axios.get.mockResolvedValueOnce({ data: { type: 'Bot' } });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=not_a_user&provider=github'
    );
  });

  it('should redirect if missing valid email', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // 1. Get User Profile (Valid)
    axios.get.mockResolvedValueOnce({
      data: { type: 'User', id: 'i', login: 'l', avatar_url: 'a' },
    });
    
    // 2. Get Emails (None primary/verified)
    axios.get.mockResolvedValueOnce({
      data: [{ primary: false, verified: false, email: 'bad@email.com' }],
    });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=missing_email&provider=github'
    );
  });

  it('should set authUser and call next if user and email found', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });

    // 1. Get User Profile
    axios.get.mockResolvedValueOnce({
      data: { type: 'User', id: 'i', login: 'l', avatar_url: 'a' },
    });

    // 2. Get Emails (Valid)
    axios.get.mockResolvedValueOnce({
      data: [{ primary: true, verified: true, email: 'e' }],
    });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i',
      avatar: 'a',
      username: 'l',
      email: 'e',
      provider: 'github',
    });

    expect(fakeNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    fetchProvider.mockImplementation(() => {
      throw new Error('fail');
    });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(handleError).toHaveBeenCalled();
  });
});