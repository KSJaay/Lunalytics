import { beforeEach, describe, expect, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import register from '../../../../server/middleware/auth/register';
import { registerUser } from '../../../../server/database/queries/user';
import { setServerSideCookie } from '../../../../shared/utils/cookies';

vi.mock('../../../../server/database/queries/user');
vi.mock('../../../../shared/utils/cookies');

describe('Register - Middleware', () => {
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

    it('should call setServerSideCookie with response, "access_token", and jwt', async () => {
      await register(fakeRequest, fakeResponse);

      expect(setServerSideCookie).toHaveBeenCalledWith(
        fakeResponse,
        'access_token',
        'test'
      );
    });

    it('should return 200 when user has been created', async () => {
      await register(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});
