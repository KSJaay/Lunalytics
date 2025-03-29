import { createRequest, createResponse } from 'node-mocks-http';
import { updateUserPermission } from '../../../../../server/database/queries/user';
import permissionUpdateMiddleware from '../../../../../server/middleware/user/permission/update';
import { AuthorizationError } from '../../../../../shared/utils/errors';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';

vi.mock('../../../../../server/database/queries/user');

describe('permissionUpdateMiddleware - Middleware', () => {
  const email = 'KSJaay@lunalytics.xyz';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    const user = {
      email: 'KSJaay@lunalytics.xyz',
      displayName: 'KSJaay',
      permission: PermissionsBits.ADMINISTRATOR,
    };

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    updateUserPermission = vi.fn();

    fakeRequest.cookies = { session_token: 'test_token' };
    fakeRequest.body = { email, permission: 3 };

    fakeResponse.locals = { user };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 401 when user doesn't have administrator permission", async () => {
    fakeResponse.locals.user.permission = PermissionsBits.VIEW_STATUS_PAGES;
    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 400 when email is not provided', async () => {
    fakeRequest.body = {};

    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
  });

  it('should return 400 when permission is not provided', async () => {
    fakeRequest.body = { email: 'KSJaay@lunalytics.xyz' };

    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
  });

  it('should return 400 when user has higher/equal permission than the one being updated', async () => {
    fakeRequest.body = { email: 'KSJaay@lunalytics.xyz', permission: 2 };

    const spy = vi.spyOn(fakeResponse, 'send');

    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
    expect(spy).toHaveBeenCalledWith('You cannot change this user permission.');
  });

  it('should return 400 when permission is not a valid number', async () => {
    fakeRequest.body = {
      email: 'KSJaay@lunalytics.xyz',
      permission: 5,
    };

    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
  });

  it('should call updateUserPermission with email and permission', async () => {
    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(updateUserPermission).toHaveBeenCalledWith(email, 3);
  });

  it('should return 401 when user does not exist', async () => {
    updateUserPermission = vi.fn().mockImplementation(() => {
      throw new AuthorizationError('User does not exist');
    });

    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 200 when user has been updated', async () => {
    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
