import axios from 'axios';
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchProvider } from '../../../../../server/database/queries/provider.js';
import discordCallback from '../../../../../server/middleware/auth/callback/discord.js';

vi.mock('axios');
vi.mock('../../../../../server/database/queries/provider.js');
vi.mock('../../../../../server/utils/config.js');
vi.mock('../../../../../server/utils/errors.js');

describe('discordCallback', () => {
  let fakeRequest, fakeResponse, fakeNext;
  beforeEach(() => {
    fakeRequest = { query: { code: 'abc' } };

    fakeResponse = {
      redirect: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      locals: {},
    };

    fakeNext = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=missing_code&provider=discord'
    );
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=provider_not_found&provider=discord'
    );
  });

  it('should redirect if user not verified', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'discord',
      clientId: 'id',
      clientSecret: 'secret',
    });
    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValue({
      data: { verified: false, email: null },
    });

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(
      '/error?code=unverified_user&provider=discord'
    );
  });

  it('should set authUser and call next if user verified', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'discord',
      clientId: 'id',
      clientSecret: 'secret',
    });
    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValue({
      data: { avatar: 'a', id: 'i', username: 'u', email: 'e', verified: true },
    });

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.locals.authUser).toEqual({
      id: 'i',
      email: 'e',
      avatar: 'a',
      username: 'u',
      provider: 'discord',
    });
    expect(fakeNext).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    fetchProvider.mockImplementation(() => {
      throw new Error('fail');
    });

    await discordCallback(fakeRequest, fakeResponse, fakeNext);

    expect(handleError).toHaveBeenCalled();
  });
});
