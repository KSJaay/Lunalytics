/**
 * @jest-environment node
 */
import { jest } from '@jest/globals'; // Good practice to import jest explicitly
import axios from 'axios';
import { createRequest, createResponse } from 'node-mocks-http';

// 1. Define the Mocks FIRST (before imports that use them)
// We use the factory function (the second argument) to ensure the mock is created
// before the real file tries to load. This prevents the "Winston" logger from crashing.
jest.mock('../../../../../server/database/queries/provider.js', () => ({
  fetchProvider: jest.fn(),
}));

jest.mock('../../../../../server/utils/config.js', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('axios');

// 2. Import the files AFTER mocking
import config from '../../../../../server/utils/config.js';
import { fetchProvider } from '../../../../../server/database/queries/provider.js';
// Note: We import the file we are testing last
import customCallback from '../../../../../server/middleware/auth/callback/custom.js';


describe('customCallback', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { code: 'abc' };
    
    // Setup generic spies for response methods
    fakeResponse.redirect = jest.fn();
    fakeResponse.status = jest.fn().mockReturnThis(); // chainable
    fakeResponse.send = jest.fn();
    fakeResponse.locals = {};
    
    // Reset the specific mock implementation for fetchProvider to null by default
    // so tests don't leak into each other
    fetchProvider.mockReset(); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await customCallback(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No code provided');
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await customCallback(fakeRequest, fakeResponse);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/auth/error');
  });

  it('should send userInfo if provider and code are valid', async () => {
    // 1. Mock the provider lookup
    fetchProvider.mockResolvedValue({
      provider: 'custom',
      clientId: 'test-id',
      clientSecret: 'test-secret',
    });

    // 2. Mock the Config URL
    config.get.mockReturnValue('https://mysite.com');

    // 3. Mock the Axios calls
    // First call (POST) returns token
    axios.post.mockResolvedValue({ data: { access_token: 'fake-token-123' } });
    // Second call (GET) returns user info
    axios.get.mockResolvedValue({ data: { id: 'user-1', email: 'test@test.com' } });

    await customCallback(fakeRequest, fakeResponse);

    // Verify the data sent back matches what we mocked in axios.get
    expect(fakeResponse.send).toHaveBeenCalledWith({ id: 'user-1', email: 'test@test.com' });
  });
});