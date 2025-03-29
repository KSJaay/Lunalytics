import { createRequest, createResponse } from 'node-mocks-http';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import authorization from '../../../server/middleware/authorization';
import { deleteCookie } from '../../../shared/utils/cookies';
import { userSessionExists } from '../../../server/database/queries/session';
import { getUserByEmail } from '../../../server/database/queries/user';

vi.mock('../../../server/database/queries/session');
vi.mock('../../../server/database/queries/user');
vi.mock('../../../shared/utils/cookies');

describe('Authorization - Middleware', () => {
  let fakeRequest;
  let fakeResponse;
  let fakeNext;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when user has a valid session_token', () => {
    let user;

    beforeEach(() => {
      user = {
        email: 'KSJaay@lunalytics.xyz',
        displayName: 'KSJaay',
        isVerified: true,
      };

      userSessionExists = vi.fn().mockReturnValue(user);
      getUserByEmail = vi.fn().mockReturnValue(user);
      fakeRequest.cookies = { session_token: 'test' };
      fakeResponse.send = vi.fn();
      fakeResponse.redirect = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should call next if session_token is missing', async () => {
      fakeRequest.cookies = {};

      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeNext).toHaveBeenCalled();
    });

    it('should call userSessionExists with session_token', async () => {
      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(userSessionExists).toHaveBeenCalledWith('test');
    });

    it('should call getUserByEmail with session_token', async () => {
      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(getUserByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should return user data if endpoint is /api/user/verfied', async () => {
      fakeRequest.url = '/api/user/verfied';

      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.send).toHaveBeenCalledWith(user);
      expect(fakeNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not verified', async () => {
      user.isVerified = false;

      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.statusCode).toEqual(403);

      expect(fakeNext).not.toHaveBeenCalled();
    });

    it('should redirect to homepage if request.url starts with /login', async () => {
      fakeRequest.url = '/login';

      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');

      expect(fakeNext).not.toHaveBeenCalled();
    });

    it('should redirect to homepage if request.url starts with /register', async () => {
      fakeRequest.url = '/register';

      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');

      expect(fakeNext).not.toHaveBeenCalled();
    });
  });

  describe('when user has an invalid session_token', () => {
    beforeEach(() => {
      fakeRequest.cookies = { session_token: 'test' };
      fakeResponse.cookie = vi.fn();
      userSessionExists = vi.fn().mockImplementation(() => null);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should delete session_token cookie and return 401', async () => {
      deleteCookie = vi.fn();

      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.statusCode).toEqual(401);

      expect(deleteCookie).toHaveBeenCalledWith(fakeResponse, 'session_token');

      expect(fakeNext).not.toHaveBeenCalled();
    });
  });

  describe('when request.url starts with /api', () => {
    beforeEach(() => {
      fakeRequest.url = '/api';

      fakeRequest.cookies = {};
    });

    it("should return 401 if session_token doesn't exist", async () => {
      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.statusCode).toEqual(401);

      expect(fakeNext).not.toHaveBeenCalled();
    });
  });

  describe('when no session_token exists', () => {
    beforeEach(() => {
      fakeRequest.url = '/login';

      fakeRequest.cookies = {};
    });

    it('should call next', async () => {
      await authorization(fakeRequest, fakeResponse, fakeNext);

      expect(fakeNext).toHaveBeenCalled();
    });
  });
});
