import { createRequest, createResponse } from 'node-mocks-http';
import {
  updateUserDisplayname,
  userExists,
} from '../../../../../server/database/queries/user';
import userUpdateUsername from '../../../../../server/middleware/user/update/username';
import validators from '../../../../../shared/validators';

vi.mock('../../../../../server/database/queries/user');
vi.mock('../../../../../shared/validators');

describe('userUpdateUsername - Middleware', () => {
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
    updateUserDisplayname = vi.fn();

    fakeRequest.cookies = { access_token: 'test_token' };

    fakeRequest.body = { displayName: 'KSJaayJr' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 401 when access_token is missing', async () => {
    fakeRequest.cookies = {};

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 when user does not exist', async () => {
    userExists = vi.fn().mockReturnValue(null);

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 200 when avatar is missing', async () => {
    fakeRequest.body = {};

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);

    expect(updateUserDisplayname).not.toHaveBeenCalled();
  });

  it('should return 200 when avatar is unchanged', async () => {
    fakeRequest.body = { displayName: 'KSJaay' };

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);

    expect(updateUserDisplayname).not.toHaveBeenCalled();
  });

  it('should return 400 when avatar is invalid', async () => {
    validators.auth.username = vi.fn().mockReturnValue(true);

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);

    expect(updateUserDisplayname).not.toHaveBeenCalled();
  });

  it('should call updateUserDisplayname with email and avatar', async () => {
    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(updateUserDisplayname).toHaveBeenCalledWith(user.email, 'KSJaayJr');
  });

  it('should return 200 when avatar is updated', async () => {
    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
