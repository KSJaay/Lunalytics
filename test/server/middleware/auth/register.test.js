/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';


jest.mock('../../../../server/database/queries/invite.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../server/database/queries/user.js', () => ({
  registerUser: jest.fn(),
}));

jest.mock('../../../../shared/utils/cookies.js', () => ({
  setServerSideCookie: jest.fn(),
}));

jest.mock('../../../../server/utils/uaParser.js', () => ({
  parseUserAgent: jest.fn(),
}));

jest.mock('../../../../server/database/queries/session.js', () => ({
  createUserSession: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import register from '../../../../server/middleware/auth/register.js';
import { registerUser } from '../../../../server/database/queries/user.js';
import { setServerSideCookie } from '../../../../shared/utils/cookies.js';
import { parseUserAgent } from '../../../../server/utils/uaParser.js';
import { createUserSession } from '../../../../server/database/queries/session.js';

describe('Register - Middleware', () => {
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
      username: 'KSJaay',
    };

    fakeRequest.headers = {
      'user-agent': 'fakeUserAgent',
    };

    // --- SETUP TIMERS & MOCKS ---
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));

    registerUser.mockResolvedValue('test'); 
    createUserSession.mockResolvedValue('test');
    parseUserAgent.mockReturnValue(fakeUserAgentData);
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('when email, password, or username is invalid', () => {
    it('should return 422 when email is invalid', async () => {
      fakeRequest.body.email = '@lunalytics';
      await register(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(422);
    });

    it('should return 422 when password is invalid', async () => {
      fakeRequest.body.password = 'test';
      await register(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(422);
    });

    it('should return 422 when username is invalid', async () => {
      fakeRequest.body.username = '!"£$%^&*(){}[]';
      await register(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('Registering a new user', () => {
    it('should call registerUser with user data', async () => {
      await register(fakeRequest, fakeResponse);

      expect(registerUser).toHaveBeenCalledWith({
        email: 'ksjaay@lunalytics.xyz',
        displayName: 'KSJaay',
        password: 'testUser123',
        avatar: null,
        createdAt: new Date().toISOString(),
      });
    });

    it('should call parseUserAgent with headers', async () => {
      await register(fakeRequest, fakeResponse);
      expect(parseUserAgent).toHaveBeenCalledWith(fakeRequest.headers['user-agent']);
    });

    it('should call createUserSession with email, device, and data', async () => {
      await register(fakeRequest, fakeResponse);
      expect(createUserSession).toHaveBeenCalledWith(
        fakeRequest.body.email.toLowerCase(),
        fakeUserAgentData.device,
        fakeUserAgentData.data
      );
    });

    it('should call setServerSideCookie with response, "session_token", and jwt', async () => {
      await register(fakeRequest, fakeResponse);
      expect(setServerSideCookie).toHaveBeenCalledWith(
        fakeResponse,
        'session_token',
        'test',
        false
      );
    });

    it('should return 200 when user has been created', async () => {
      await register(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});