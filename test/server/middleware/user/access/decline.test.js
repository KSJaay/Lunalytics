import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import { declineAccess } from '../../../../../server/database/queries/user';
import { AuthorizationError } from '../../../../../shared/utils/errors';
import accessDeclineMiddleware from '../../../../../server/middleware/user/access/declineUser';

vi.mock('../../../../../server/database/queries/user');

describe('accessRemoveMiddleware - Middleware', () => {
  const email = 'KSJaay@lunalytics.xyz';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { email };

    declineAccess = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 when email is not passed', async () => {
    fakeRequest.body = {};

    await accessDeclineMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
  });

  it('should return 401 when declineAccess throws an error', async () => {
    declineAccess = vi.fn().mockImplementation(() => {
      throw new AuthorizationError('User does not exist');
    });

    await accessDeclineMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should call declineAccess with email', async () => {
    await accessDeclineMiddleware(fakeRequest, fakeResponse);

    expect(declineAccess).toHaveBeenCalledWith(email);
  });

  it('should return 200 when email is passed', async () => {
    await accessDeclineMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
