import { beforeEach, describe, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import SQLite from '../../../../server/database/sqlite/setup';
import login from '../../../../server/middleware/auth/login';
import { setServerSideCookie } from '../../../../server/utils/cookies';
import { signInUser } from '../../../../server/database/queries/user';

vi.mock('../../../../server/database/sqlite/setup');
vi.mock('../../../../server/database/queries/user');
vi.mock('../../../../server/utils/cookies');

describe('Login - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    isVerified: false,
  };

  let fakeRequest;
  let fakeResponse;
  let builders;

  beforeEach(() => {
    builders = {
      insert: vi.fn(),
      where: vi.fn().mockImplementation(() => {
        return { first: vi.fn().mockReturnValue(null) };
      }),
      update: vi.fn(),
    };

    SQLite.client = () => builders;
    signInUser = vi.fn().mockReturnValue({ jwt: 'test', user });
    setServerSideCookie = vi.fn();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = {
      email: 'KSJaay@lunalytics.xyz',
      password: 'testUser123',
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when email or password is invalid', () => {
    it('should return 422 when email is invalid', async () => {
      fakeRequest.body.email = '@lunalytics';

      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });

    it('should return 422 when password is invalid', async () => {
      fakeRequest.body.password = 'test';

      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('When user exists', () => {
    it('should return 418 when user is not verified', async () => {
      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(418);
    });

    it('should call setServerSideCookies with response, "access_token", and jwt', async () => {
      await login(fakeRequest, fakeResponse);

      expect(setServerSideCookie).toHaveBeenCalledWith(
        fakeResponse,
        'access_token',
        'test'
      );
    });

    it('should return 200 when user is verified', async () => {
      signInUser = vi
        .fn()
        .mockReturnValue({ jwt: 'test', user: { ...user, isVerified: true } });

      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});
