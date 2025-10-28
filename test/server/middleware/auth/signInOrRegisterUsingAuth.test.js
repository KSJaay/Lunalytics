import { createRequest, createResponse } from 'node-mocks-http';
import {
  getUserByEmail,
  registerSsoUser,
} from '../../../../server/database/queries/user.js';
import { handleError } from '../../../../server/utils/errors.js';
import { parseUserAgent } from '../../../../server/utils/uaParser.js';
import { createUserSession } from '../../../../server/database/queries/session.js';
import { fetchConnectionByEmail } from '../../../../server/database/queries/connection.js';
import signInOrRegisterUsingAuth from '../../../../server/middleware/auth/signInOrRegisterUsingAuth.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../shared/utils/cookies.js');
vi.mock('../../../../server/utils/uaParser.js');
vi.mock('../../../../server/database/queries/user.js');
vi.mock('../../../../server/database/queries/session.js');
vi.mock('../../../../server/database/queries/connection.js');

describe('signInOrRegisterUsingAuth', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.headers = { 'user-agent': 'test-agent' };
    fakeRequest.protocol = 'http';

    fakeResponse.locals = {
      authUser: {
        avatar: 'a',
        id: 'id',
        username: 'user',
        email: 'test@example.com',
        provider: 'google',
      },
    };
    fakeResponse.redirect = vi.fn().mockReturnThis();
    fakeResponse.json = vi.fn().mockReturnThis();
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.send = vi.fn().mockReturnThis();
    fakeResponse.sendStatus = vi.fn().mockReturnThis();

    parseUserAgent.mockReturnValue({ device: 'dev', data: {} });
    createUserSession.mockResolvedValue('token');
    handleError.mockImplementation((error, res) => {
      res.json({ error: error.message });
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call fetchConnectionByEmail with correct params', async () => {
    fetchConnectionByEmail.mockResolvedValue(null);
    getUserByEmail.mockResolvedValue(null);
    registerSsoUser.mockResolvedValue(null);

    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);

    expect(fetchConnectionByEmail).toHaveBeenCalledWith('google', 'id');
  });

  it('should redirect to /home if user is verified', async () => {
    fetchConnectionByEmail.mockResolvedValue(true);
    getUserByEmail.mockResolvedValue({ isVerified: true });
    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);
    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });

  it('should redirect to /verify if user is not verified', async () => {
    fetchConnectionByEmail.mockResolvedValue(true);
    getUserByEmail.mockResolvedValue({ isVerified: false });
    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);
    expect(fakeResponse.redirect).toHaveBeenCalledWith('/verify');
  });

  it('should handle errors gracefully', async () => {
    fetchConnectionByEmail.mockRejectedValue(new Error('fail'));

    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
