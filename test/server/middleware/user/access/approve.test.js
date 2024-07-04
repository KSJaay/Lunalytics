import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import { approveAccess } from '../../../../../server/database/queries/user';
import accessApproveMiddleware from '../../../../../server/middleware/user/access/approveUser';
import { AuthorizationError } from '../../../../../shared/utils/errors';

vi.mock('../../../../../server/database/queries/user');

describe('accessApproveMiddleware - Middleware', () => {
  const email = 'KSJaay@lunalytics.xyz';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { email };

    approveAccess = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 when email is not passed', async () => {
    fakeRequest.body = {};

    await accessApproveMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
  });

  it('should return 401 when approveAccess throws an error', async () => {
    approveAccess = vi.fn().mockImplementation(() => {
      throw new AuthorizationError('User does not exist');
    });

    await accessApproveMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should call approveAccess with email', async () => {
    await accessApproveMiddleware(fakeRequest, fakeResponse);

    expect(approveAccess).toHaveBeenCalledWith(email);
  });

  it('should return 200 when email is passed', async () => {
    await accessApproveMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
