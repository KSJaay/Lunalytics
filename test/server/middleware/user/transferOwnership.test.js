import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import {
  userExists,
  emailExists,
  transferOwnership,
} from '../../../../server/database/queries/user';
import transferOwnershipMiddleware from '../../../../server/middleware/user/transferOwnership';

vi.mock('../../../../server/database/queries/user');

describe('transferOwnershipMiddleware - Middleware', () => {
  const access_token = 'test_token';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    userExists = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 1 });
    emailExists = vi.fn().mockReturnValue(true);
    transferOwnership = vi.fn();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.cookies = { access_token };
    fakeRequest.body = { email: '123@lunalytics.xyz' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 401 when access_token is not provided', async () => {
    fakeRequest.cookies = {};

    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 400 when email is not provided', async () => {
    fakeRequest.body = {};

    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
  });

  it('should call userExists with access_token', async () => {
    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(userExists).toHaveBeenCalledWith(access_token);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user does has ownership', async () => {
    userExists = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 2 });

    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should call emailExists with body email', async () => {
    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(emailExists).toHaveBeenCalledWith('123@lunalytics.xyz');
  });

  it('should return 400 when email does not exist', async () => {
    emailExists = vi.fn().mockReturnValue(false);

    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);

    expect(transferOwnership).not.toHaveBeenCalled();
  });

  it('should call transferOwnership with user.email and body.email', async () => {
    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(transferOwnership).toHaveBeenCalledWith(
      'KSJaay@lunalytics.xyz',
      '123@lunalytics.xyz'
    );
  });

  it('should return 200', async () => {
    await transferOwnershipMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
