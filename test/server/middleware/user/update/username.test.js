import { createRequest, createResponse } from 'node-mocks-http';
import { updateUserDisplayname } from '../../../../../server/database/queries/user';
import userUpdateUsername from '../../../../../server/middleware/user/update/username';

vi.mock('../../../../../server/database/queries/user');

describe('userUpdateUsername - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    isVerified: true,
  };

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    updateUserDisplayname = vi.fn();

    fakeRequest.cookies = { session_token: 'test_token' };
    fakeRequest.body = { displayName: 'KSJaayJr' };

    fakeResponse.locals = { user };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 when username is missing', async () => {
    fakeRequest.body = {};

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);

    expect(updateUserDisplayname).not.toHaveBeenCalled();
  });

  it('should return 200 when username is unchanged', async () => {
    fakeRequest.body = { displayName: 'KSJaay' };

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);

    expect(updateUserDisplayname).not.toHaveBeenCalled();
  });

  it('should return 400 when username is invalid', async () => {
    fakeRequest.body.displayName = '*^%$#!@#';

    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(400);

    expect(updateUserDisplayname).not.toHaveBeenCalled();
  });

  it('should call updateUserDisplayname with email', async () => {
    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(updateUserDisplayname).toHaveBeenCalledWith(user.email, 'KSJaayJr');
  });

  it('should return 200 when username is updated', async () => {
    await userUpdateUsername(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);
  });
});
