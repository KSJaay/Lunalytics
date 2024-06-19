import { createRequest, createResponse } from 'node-mocks-http';
import {
  updateUserPermission,
  userExists,
} from '../../../../../server/database/queries/user';
import permissionUpdateMiddleware from '../../../../../server/middleware/user/permission/update';
import { AuthorizationError } from '../../../../../shared/utils/errors';

vi.mock('../../../../../server/database/queries/user');

describe('permissionUpdateMiddleware - Middleware', () => {
  const email = 'KSJaay@lunalytics.xyz';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    userExists = vi.fn().mockReturnValue({ email, permission: 2 });
    updateUserPermission = vi.fn();

    fakeRequest.cookies = { access_token: 'test_token' };
    fakeRequest.body = { email, permission: 3 };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 401 when access_token is missing', async () => {
    fakeRequest.cookies = {};

    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await permissionUpdateMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user is not an admin/owner', async () => {
    userExists = vi.fn().mockReturnValue({ email, permission: 3 });

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
