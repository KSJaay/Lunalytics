import { createRequest, createResponse } from 'node-mocks-http';
import { updateUserAvatar } from '../../../../../server/database/queries/user';
import userUpdateAvatar from '../../../../../server/middleware/user/update/avatar';
import validators from '../../../../../shared/validators';

vi.mock('../../../../../server/database/queries/user');
vi.mock('../../../../../shared/validators');

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

    updateUserAvatar = vi.fn();

    fakeRequest.cookies = { session_token: 'test_token' };
    fakeRequest.body = { avatar: 'Hamster' };

    fakeResponse.locals = { user };
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
