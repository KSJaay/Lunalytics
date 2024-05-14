import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import { userExists } from '../../../../server/database/queries/user';
import hasEditorPermissions from '../../../../server/middleware/user/hasEditor';

vi.mock('../../../../server/database/queries/user');

describe('hasEditorPermissions - Middleware', () => {
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

    await hasEditorPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should call userExists with access_token', async () => {
    await hasEditorPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(userExists).toHaveBeenCalledWith(access_token);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await hasEditorPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user does not have admin permissions', async () => {
    userExists = vi
      .fn()
      .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission: 4 });

    await hasEditorPermissions(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  [1, 2, 3].forEach((permission) => {
    it(`should call next when user has ${permission} permission`, async () => {
      userExists = vi
        .fn()
        .mockReturnValue({ email: 'KSJaay@lunalytics.xyz', permission });

      await hasEditorPermissions(fakeRequest, fakeResponse, fakeNext);

      expect(fakeNext).toHaveBeenCalled();
    });
  });
});
