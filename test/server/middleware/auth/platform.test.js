import config from '../../../../server/utils/config.js';
import { createRequest, createResponse } from 'node-mocks-http';
import { getAuthRedirectUrl } from '../../../../shared/utils/authenication.js';
import { fetchProvider } from '../../../../server/database/queries/provider.js';
import redirectUsingProviderMiddleware from '../../../../server/middleware/auth/platform.js';

vi.mock('../../../../server/utils/config.js');
vi.mock('../../../../shared/utils/authenication.js');
vi.mock('../../../../server/database/queries/provider.js');

describe('redirectUsingProviderMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.params = { provider: 'google' };
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.send = vi.fn().mockReturnThis();
    fakeResponse.redirect = vi.fn().mockReturnThis();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 if no provider provided', async () => {
    fakeRequest.params.provider = undefined;

    await redirectUsingProviderMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No provider provided');
  });

  it('should return 404 if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await redirectUsingProviderMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.send).toHaveBeenCalledWith(
      'Unable to find SSO for provider'
    );
  });

  it('should redirect to provider URL if provider found', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'google',
      clientId: 'abc',
    });

    config.get.mockReturnValue('https://site.com');
    getAuthRedirectUrl.mockReturnValue('https://auth.url');

    await redirectUsingProviderMiddleware(fakeRequest, fakeResponse);

    expect(getAuthRedirectUrl).toHaveBeenCalledWith(
      'google',
      'abc',
      'https://site.com/api/auth/callback/google'
    );
    expect(fakeResponse.redirect).toHaveBeenCalledWith('https://auth.url');
  });
});
