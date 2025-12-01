import axios from 'axios';
import config from '../../../../../server/utils/config.js';
import { fetchProvider } from '../../../../../server/database/queries/provider.js';
import customCallback from '../../../../../server/middleware/auth/callback/custom.js';
import { createRequest, createResponse } from 'node-mocks-http';

vi.mock('axios');
vi.mock('../../../../../server/database/queries/provider.js');
vi.mock('../../../../../server/utils/config.js');

describe('customCallback', () => {
  let fakeRequest, fakeResponse;
  let next;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeRequest.query = { code: 'abc' };
    fakeResponse.redirect = vi.fn();
    fakeResponse.locals = {};
    next = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await customCallback(fakeRequest, fakeResponse, next);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=missing_code&provider=custom'
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await customCallback(fakeRequest, fakeResponse, next);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/auth/error?code=provider_not_found&provider=custom'
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should set authUser and call next if provider and code are valid', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'custom',
      clientId: 'id',
      clientSecret: 'secret',
      data: {
        tokenUrl: 'https://site.com/token',
        userInfoUrl: 'https://site.com/userinfo',
      },
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValue({
      data: { id: 'i', email: 'e', avatar: 'a', username: 'u' },
    });

    await customCallback(fakeRequest, fakeResponse, next);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i',
      email: 'e',
      avatar: 'a',
      username: 'u',
      provider: 'custom',
    });
    expect(next).toHaveBeenCalled();
  });
  it('should redirect if user info is missing or email is not present', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'custom',
      clientId: 'id',
      clientSecret: 'secret',
      data: {
        tokenUrl: 'https://site.com/token',
        userInfoUrl: 'https://site.com/userinfo',
      },
    });
    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValue({ data: {} });

    await customCallback(fakeRequest, fakeResponse, next);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=unverified_user&provider=custom'
    );
    expect(next).not.toHaveBeenCalled();
  });
});
