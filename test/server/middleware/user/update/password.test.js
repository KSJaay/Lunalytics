import { createRequest, createResponse } from 'node-mocks-http';
import {
  getUserPasswordUsingEmail,
  updateUserPassword,
} from '../../../../../server/database/queries/user';
import userUpdatePassword from '../../../../../server/middleware/user/update/password';
import { verifyPassword } from '../../../../../server/utils/hashPassword';

vi.mock('../../../../../server/database/queries/user');
vi.mock('../../../../../server/utils/hashPassword');

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

    verifyPassword = vi.fn().mockReturnValue(true);
    updateUserPassword = vi.fn();
    getUserPasswordUsingEmail = vi.fn().mockReturnValue('testUser123');

    fakeRequest.cookies = { session_token: 'test_token' };
    fakeRequest.body = {
      currentPassword: 'testUser123',
      newPassword: 'testUser1234',
    };

    fakeResponse.locals = { user };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call getUserPasswordUsingEmail with user.email', async () => {
    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(getUserPasswordUsingEmail).toHaveBeenCalledWith(user.email);
  });

  it('should call verifyPassword with currentPassword and user.password', async () => {
    await userUpdatePassword(fakeRequest, fakeResponse);

    expect(verifyPassword).toHaveBeenCalledWith('testUser123', 'testUser123');
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
