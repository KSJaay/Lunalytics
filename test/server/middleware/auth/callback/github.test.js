import axios from 'axios';
import { createRequest, createResponse } from 'node-mocks-http';
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchProvider } from '../../../../../server/database/queries/provider.js';
import githubCallback from '../../../../../server/middleware/auth/callback/github.js';

vi.mock('axios');
vi.mock('../../../../../server/database/queries/provider.js');
vi.mock('../../../../../server/utils/config.js');
vi.mock('../../../../../server/utils/errors.js');

describe('githubCallback', () => {
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

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No code provided');
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/auth/error');
  });

  it('should redirect if not a user', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValueOnce({ data: { type: 'Bot' } });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=not_a_user&provider=github'
    );
  });

  it('should redirect if missing email', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValueOnce({
      data: { type: 'User', id: 'i', login: 'l', avatar_url: 'a' },
    });
    axios.get.mockResolvedValueOnce({
      data: [{ primary: false, verified: false }],
    });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=missing_email&provider=github'
    );
  });

  it('should set authUser and call next if user and email found', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValueOnce({
      data: { type: 'User', id: 'i', login: 'l', avatar_url: 'a' },
    });
    axios.get.mockResolvedValueOnce({
      data: [{ primary: true, verified: true, email: 'e' }],
    });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i',
      avatar: 'a',
      username: 'l',
      email: 'e',
      provider: 'github',
    });

    expect(fakeNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    fetchProvider.mockImplementation(() => {
      throw new Error('fail');
    });

    await githubCallback(fakeRequest, fakeResponse, fakeNext);

    expect(handleError).toHaveBeenCalled();
  });
});
