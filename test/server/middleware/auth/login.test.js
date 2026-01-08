import { createRequest, createResponse } from 'node-mocks-http';
import database from '../../../../server/database/connection';
import login from '../../../../server/middleware/auth/login';
import { setServerSideCookie } from '../../../../shared/utils/cookies';
import { signInUser } from '../../../../server/database/queries/user';
import { parseUserAgent } from '../../../../server/utils/uaParser';
import { createUserSession } from '../../../../server/database/queries/session';

vi.mock('../../../../server/database/connection');
vi.mock('../../../../server/database/queries/user');
vi.mock('../../../../shared/utils/cookies');
vi.mock('../../../../server/utils/uaParser');
vi.mock('../../../../server/database/queries/session');

describe('Login - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    isVerified: false,
  };

  const fakeUserAgentData = {
    device: 'testDevice',
    data: { test: 'test' },
  };

  let fakeRequest;
  let fakeResponse;
  let builders;

  beforeEach(() => {
    builders = {
      insert: vi.fn(),
      where: vi.fn().mockImplementation(() => {
        return { first: vi.fn().mockReturnValue(null) };
      }),
      update: vi.fn(),
    };

    database.client = () => builders;
    signInUser = vi.fn().mockReturnValue(user);
    setServerSideCookie = vi.fn();
    parseUserAgent = vi.fn().mockReturnValue(fakeUserAgentData);
    createUserSession = vi.fn().mockReturnValue('test');

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = {
      email: 'KSJaay@lunalytics.xyz',
      password: 'testUser123',
    };

    fakeRequest.headers = {
      'user-agent': 'fakeUserAgent',
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when email or password is invalid', () => {
    it('should return 422 when email is invalid', async () => {
      fakeRequest.body.email = '@lunalytics';

      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });

    it('should return 422 when password is invalid', async () => {
      fakeRequest.body.password = 'test';

      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('When user exists', () => {
    it('should return 418 when user is not verified', async () => {
      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(418);
    });

    it('should call parseUserAgent with user agent', async () => {
      await login(fakeRequest, fakeResponse);

      expect(parseUserAgent).toHaveBeenCalledWith(
        fakeRequest.headers['user-agent']
      );
    });

    it('should call signInUser with email and password', async () => {
      await login(fakeRequest, fakeResponse);

      expect(signInUser).toHaveBeenCalledWith(
        fakeRequest.body.email.toLowerCase(),
        fakeRequest.body.password
      );
    });

    it('should call createUserSession with email, device, and data', async () => {
      await login(fakeRequest, fakeResponse);

      expect(createUserSession).toHaveBeenCalledWith(
        fakeRequest.body.email,
        fakeUserAgentData.device,
        fakeUserAgentData.data
      );
    });

    it('should call setServerSideCookies with response, "session_token", and jwt', async () => {
      await login(fakeRequest, fakeResponse);

      expect(setServerSideCookie).toHaveBeenCalledWith(
        fakeResponse,
        'session_token',
        'test',
        false
      );
    });

    it('should return 200 when user is verified', async () => {
      signInUser = vi.fn().mockReturnValue({ ...user, isVerified: true });

      await login(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});
