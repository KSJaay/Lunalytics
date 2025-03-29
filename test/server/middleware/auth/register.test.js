import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import register from '../../../../server/middleware/auth/register';
import { registerUser } from '../../../../server/database/queries/user';
import { setServerSideCookie } from '../../../../shared/utils/cookies';
import { parseUserAgent } from '../../../../server/utils/uaParser';
import { createUserSession } from '../../../../server/database/queries/session';

vi.mock('../../../../server/database/queries/user');
vi.mock('../../../../shared/utils/cookies');
vi.mock('../../../../server/utils/uaParser');
vi.mock('../../../../server/database/queries/session');

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

    vi.useFakeTimers({
      now: new Date('2023-01-01T00:00:00.000Z').getTime(),
    });

    registerUser = vi.fn().mockReturnValue('test');
    setServerSideCookie = vi.fn();
    parseUserAgent = vi.fn().mockReturnValue(fakeUserAgentData);
    createUserSession = vi.fn().mockReturnValue('test');

    fakeRequest.headers = {
      'user-agent': 'fakeUserAgent',
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

      expect(parseUserAgent).toHaveBeenCalledWith(
        fakeRequest.headers['user-agent']
      );
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
        'test'
      );
    });

    it('should return 200 when user has been created', async () => {
      await register(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});
