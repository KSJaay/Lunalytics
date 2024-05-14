import { createRequest, createResponse } from 'node-mocks-http';
import {
  updateUserAvatar,
  userExists,
} from '../../../../../server/database/queries/user';
import userUpdateAvatar from '../../../../../server/middleware/user/update/avatar';
import validators from '../../../../../server/utils/validators';

vi.mock('../../../../../server/database/queries/user');
vi.mock('../../../../../server/utils/validators');

describe('userUpdateAvatar - Middleware', () => {
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
    updateUserAvatar = vi.fn();

    fakeRequest.cookies = { access_token: 'test_token' };

    fakeRequest.body = { avatar: 'Hamster' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 401 when access_token is missing', async () => {
    fakeRequest.cookies = {};

    await userUpdateAvatar(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await userUpdateAvatar(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 200 when avatar is missing', async () => {
    fakeRequest.body = {};

    await userUpdateAvatar(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);

    expect(updateUserAvatar).not.toHaveBeenCalled();
  });

  it('should return 200 when avatar is unchanged', async () => {
    fakeRequest.body = { avatar: 'Panda' };

    await userUpdateAvatar(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);

    expect(updateUserAvatar).not.toHaveBeenCalled();
  });

  it('should return 400 when avatar is invalid', async () => {
    validators.user.isAvatar = vi.fn().mockReturnValue(true);

    await userUpdateAvatar(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);

    expect(updateUserAvatar).not.toHaveBeenCalled();
  });

  it('should call updateUserAvatar with email and avatar', async () => {
    await userUpdateAvatar(fakeRequest, fakeResponse);

    expect(updateUserAvatar).toHaveBeenCalledWith(user.email, 'Hamster');
  });

  it('should return 200 when avatar is updated', async () => {
    await userUpdateAvatar(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
