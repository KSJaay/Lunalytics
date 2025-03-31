import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import {
  declineAccess,
  emailIsOwner,
} from '../../../../server/database/queries/user';
import deleteAccountMiddleware from '../../../../server/middleware/user/deleteAccount';

vi.mock('../../../../server/database/queries/user');

describe('deleteAccountMiddleware - Middleware', () => {
  const session_token = 'test_token';

  let fakeRequest;
  let fakeResponse;
  let fakeNext;

  beforeEach(() => {
    emailIsOwner = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 2 });
    declineAccess = vi.fn();

    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();

    fakeRequest.cookies = { session_token };
    fakeResponse.locals = { user: { email: 'KSJaay@lunalytics.xyz' } };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 403 when user does has ownership', async () => {
    emailIsOwner = vi
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
