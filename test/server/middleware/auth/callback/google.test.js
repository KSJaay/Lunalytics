import axios from 'axios';
import { createRequest, createResponse } from 'node-mocks-http';
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchProvider } from '../../../../../server/database/queries/provider.js';
import googleCallback from '../../../../../server/middleware/auth/callback/google.js';

vi.mock('axios');
vi.mock('../../../../../server/database/queries/provider.js');
vi.mock('../../../../../server/utils/config.js');
vi.mock('../../../../../server/utils/errors.js');

describe('googleCallback', () => {
  let fakeRequest, fakeResponse, fakeNext;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { code: 'abc' };
    fakeResponse.redirect = vi.fn();
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.send = vi.fn();
    fakeResponse.locals = {};
    fakeNext = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await googleCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No code provided');
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await googleCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/auth/error?code=provider_not_found&provider=google'
    );
  });

  it('should redirect if user not verified', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'google',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValue({ data: { verified_email: false } });

    await googleCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=unverified_user&provider=google'
    );
  });

  it('should set authUser and call next if user verified', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'google',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValue({
      data: { picture: 'p', id: 'i', email: 'e', verified_email: true },
    });

    await googleCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i',
      email: 'e',
      avatar: 'p',
      username: 'unknown',
      provider: 'google',
    });
    expect(fakeNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    fetchProvider.mockImplementation(() => {
      throw new Error('fail');
    });

    await googleCallback(fakeRequest, fakeResponse, fakeNext);

    expect(handleError).toHaveBeenCalled();
  });
});
