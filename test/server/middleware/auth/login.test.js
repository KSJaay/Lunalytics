/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS ---
const mockSQLiteBuilder = {
  insert: jest.fn(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  update: jest.fn(),
};

jest.mock('../../../../server/database/sqlite/setup', () => ({
  __esModule: true,
  default: {
    client: jest.fn(() => mockSQLiteBuilder),
  },
}));

jest.mock('../../../../server/database/queries/user', () => ({
  signInUser: jest.fn(),
}));

jest.mock('../../../../shared/utils/cookies', () => ({
  setServerSideCookie: jest.fn(),
}));

jest.mock('../../../../server/utils/uaParser', () => ({
  parseUserAgent: jest.fn(),
}));

jest.mock('../../../../server/database/queries/session', () => ({
  createUserSession: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import login from '../../../../server/middleware/auth/login.js'; // Ensure extension .js
import SQLite from '../../../../server/database/sqlite/setup.js';
import { setServerSideCookie } from '../../../../shared/utils/cookies.js';
import { signInUser } from '../../../../server/database/queries/user.js';
import { parseUserAgent } from '../../../../server/utils/uaParser.js';
import { createUserSession } from '../../../../server/database/queries/session.js';

describe('Login - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    isVerified: false,
  };

  const fakeUserAgentData = {
    device: 'testDevice',
    data: { test: 'test' },
  };

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = {
      email: 'KSJaay@lunalytics.xyz',
      password: 'testUser123',
    };

    fakeRequest.headers = {
      'user-agent': 'fakeUserAgent',
    };

    // Default successful mocks
    signInUser.mockResolvedValue(user); // Assuming DB calls are async
    parseUserAgent.mockReturnValue(fakeUserAgentData);
    createUserSession.mockResolvedValue('test-token');
    
    // Reset call counts
    jest.clearAllMocks();
  });

  describe('when email or password is invalid format', () => {
    it('should return 422 when email is invalid', async () => {
      fakeRequest.body.email = '@lunalytics'; // Invalid format
      await login(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(422);
    });

    it('should return 422 when password is invalid (too short)', async () => {
      fakeRequest.body.password = 'test'; // Too short
      await login(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('When input format is valid', () => {
    it('should return 418 when user is found but not verified', async () => {
      // User is returned, but isVerified is false (from default mock)
      await login(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(418);
    });

    it('should call parseUserAgent with user agent', async () => {
      await login(fakeRequest, fakeResponse);
      expect(parseUserAgent).toHaveBeenCalledWith(
        fakeRequest.headers['user-agent']
      );
    });

    it('should call signInUser with email and password', async () => {
      await login(fakeRequest, fakeResponse);
      expect(signInUser).toHaveBeenCalledWith(
        fakeRequest.body.email.toLowerCase(),
        fakeRequest.body.password
      );
    });

    it('should call createUserSession with email, device, and data', async () => {
      await login(fakeRequest, fakeResponse);
      expect(createUserSession).toHaveBeenCalledWith(
        fakeRequest.body.email,
        fakeUserAgentData.device,
        fakeUserAgentData.data
      );
    });

    it('should call setServerSideCookies with response, "session_token", and jwt', async () => {
      await login(fakeRequest, fakeResponse);
      expect(setServerSideCookie).toHaveBeenCalledWith(
        fakeResponse,
        'session_token',
        'test-token',
        false
      );
    });

    it('should return 200 when user is verified', async () => {
      // OVERRIDE the mock for this specific test
      signInUser.mockResolvedValue({ ...user, isVerified: true });

      await login(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});