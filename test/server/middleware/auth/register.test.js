import { beforeEach, describe, expect, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import register from '../../../../server/middleware/auth/register';
import {
  fetchMembers,
  registerUser,
} from '../../../../server/database/queries/user';
import { setServerSideCookie } from '../../../../server/utils/cookies';

vi.mock('../../../../server/database/queries/user');
vi.mock('../../../../server/utils/cookies');

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

    registerUser = vi.fn().mockReturnValue('test');
    fetchMembers = vi.fn().mockReturnValue([]);
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

  describe('When no members exist', () => {
    it('should call registerUser with permission 1 and isVerified true', async () => {
      await register(fakeRequest, fakeResponse);

      expect(fetchMembers).toHaveBeenCalled();

      expect(registerUser).toHaveBeenCalledWith({
        email: 'ksjaay@lunalytics.xyz',
        displayName: 'KSJaay',
        password: 'testUser123',
        avatar: null,
        permission: 1,
        isVerified: true,
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

    it('should return 201 when user has been created', async () => {
      await register(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(201);
    });
  });

  describe('When members exist', () => {
    beforeEach(() => {
      fetchMembers = vi.fn().mockReturnValue([
        {
          email: 'ksjaay@lunalytics.xyz',
          displayName: 'KSJaay',
          password: 'testUser123',
          avatar: null,
          permission: 1,
          isVerified: true,
        },
      ]);
    });

    it('should call registerUser with user data', async () => {
      await register(fakeRequest, fakeResponse);

      expect(fetchMembers).toHaveBeenCalled();

      expect(registerUser).toHaveBeenCalledWith({
        email: 'ksjaay@lunalytics.xyz',
        displayName: 'KSJaay',
        password: 'testUser123',
        avatar: null,
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
