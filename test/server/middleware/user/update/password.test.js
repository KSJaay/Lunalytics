import { createRequest, createResponse } from 'node-mocks-http';
import {
  updateUserPassword,
  userExists,
} from '../../../../../server/database/queries/user';
import userUpdatePassword from '../../../../../server/middleware/user/update/password';
import { verifyPassword } from '../../../../../shared/utils/hashPassword';

vi.mock('../../../../../server/database/queries/user');
vi.mock('../../../../../shared/utils/hashPassword');

describe('userUpdatePassword - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    avatar: 'Panda',
    isVerified: true,
  };

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    userExists = vi.fn().mockReturnValue(user);
    verifyPassword = vi.fn().mockReturnValue(true);
    updateUserPassword = vi.fn();

    fakeRequest.cookies = { access_token: 'test_token' };

    fakeRequest.body = {
      currentPassword: 'testUser123',
      newPassword: 'testUser1234',
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 401 when access_token is missing', async () => {
    fakeRequest.cookies = {};

    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it("should return 401 when currentPassword and user.password aren't the same", async () => {
    verifyPassword = vi.fn().mockReturnValue(false);
    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
    expect(fakeResponse._getJSONData()).toEqual({
      current: 'Password does not match your current password',
    });
  });

  it('should return 400 when password is invalid', async () => {
    fakeRequest.body.newPassword = 'test';

    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);
  });

  it('should call updateUserPassword with email and newPassword', async () => {
    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(updateUserPassword).toHaveBeenCalledWith(user.email, 'testUser1234');
  });

  it('should return 200 when password is updated', async () => {
    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
