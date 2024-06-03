import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import {
  userExists,
  declineAccess,
} from '../../../../server/database/queries/user';
import deleteAccountMiddleware from '../../../../server/middleware/user/deleteAccount';

vi.mock('../../../../server/database/queries/user');

describe('deleteAccountMiddleware - Middleware', () => {
  const access_token = 'test_token';

  let fakeRequest;
  let fakeResponse;
  let fakeNext;

  beforeEach(() => {
    userExists = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 2 });
    declineAccess = vi.fn();

    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();

    fakeRequest.cookies = { access_token };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 401 when access_token is not provided', async () => {
    fakeRequest.cookies = {};

    await deleteAccountMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should call userExists with access_token', async () => {
    await deleteAccountMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(userExists).toHaveBeenCalledWith(access_token);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await deleteAccountMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 403 when user does has ownership', async () => {
    userExists = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 1 });

    await deleteAccountMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(403);

    expect(fakeResponse._getData()).toEqual(
      'Please transfer ownership before deleting your account.'
    );
  });

  it('should call declineAccess with user email', async () => {
    await deleteAccountMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(declineAccess).toHaveBeenCalledWith('KSJaay@lunalytics.xyz');
  });

  it('should return 200', async () => {
    await deleteAccountMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
