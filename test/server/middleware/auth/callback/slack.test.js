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
import slackCallback from '../../../../../server/middleware/auth/callback/slack.js';

describe('slackCallback', () => {
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
    
    await slackCallback(fakeRequest, fakeResponse, fakeNext);
    
    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No code provided');
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);
    
    await slackCallback(fakeRequest, fakeResponse, fakeNext);
    
    expect(fakeResponse.redirect).toHaveBeenCalledWith('/auth/error');
  });

  it('should redirect if user/email not found in Slack response', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'slack',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    
    // Mock Token Exchange
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // Mock User Info (Empty object, so email is missing)
    axios.get.mockResolvedValue({ data: {} });

    await slackCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/auth/error?code=unverified_user&provider=slack'
    );
  });

  it('should set authUser and call next if user found', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'slack',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    
    // Mock Valid User Info
    axios.get.mockResolvedValue({
      data: { email: 'e', sub: 'i', picture: 'p', name: 'n' },
    });

    await slackCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i', // Mapped from 'sub'
      email: 'e',
      avatar: 'p',
      username: 'n',
      provider: 'slack',
    });
    
    expect(fakeNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    fetchProvider.mockImplementation(() => {
      throw new Error('fail');
    });

    await slackCallback(fakeRequest, fakeResponse, fakeNext);

    expect(handleError).toHaveBeenCalled();
  });
});