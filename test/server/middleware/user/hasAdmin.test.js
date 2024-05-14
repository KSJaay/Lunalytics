import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import { userExists } from '../../../../server/database/queries/user';
import hasAdminPermissions from '../../../../server/middleware/user/hasAdmin';

vi.mock('../../../../server/database/queries/user');

describe('hasAdminPermissions - Middleware', () => {
  const access_token = 'test_token';

  let fakeRequest;
  let fakeResponse;
  let fakeNext;

  beforeEach(() => {
    userExists = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 1 });

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

    await hasAdminPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should call userExists with access_token', async () => {
    await hasAdminPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(userExists).toHaveBeenCalledWith(access_token);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await hasAdminPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user does not have admin permissions', async () => {
    userExists = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 3 });

    await hasAdminPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  [1, 2].forEach((permission) => {
    it(`should call next when user has ${permission} permission`, async () => {
      userExists = vi
        .fn()
        .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission });

      await hasAdminPermissions(fakeRequest, fakeResponse, fakeNext);

      expect(fakeNext).toHaveBeenCalled();
    });
  });
});
