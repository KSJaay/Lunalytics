import { createRequest, createResponse } from 'node-mocks-http';
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchProviders } from '../../../../../server/database/queries/provider.js';
import getConfigMiddleware from '../../../../../server/middleware/auth/config/getConfig.js';

vi.mock('../../../../../server/database/queries/provider.js');
vi.mock('../../../../../server/utils/config.js');
vi.mock('../../../../../server/utils/errors.js');

describe('getConfigMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.json = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return nativeSignin true and sso false if no providers', async () => {
    fetchProviders.mockResolvedValue([]);

    config.get.mockReturnValue(undefined);

    await getConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.json).toHaveBeenCalledWith({
      nativeSignin: true,
      register: true,
      sso: false,
      providers: [],
    });
  });

  it('should return sso true and nativeSignin from config if SSO enabled', async () => {
    fetchProviders.mockResolvedValue([{ provider: 'google', enabled: true }]);

    config.get.mockImplementation((key) =>
      key === 'nativeSignin' ? false : true
    );

    await getConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.json).toHaveBeenCalledWith({
      nativeSignin: false,
      register: true,
      sso: true,
      providers: ['google'],
    });
  });

  it('should handle errors gracefully', async () => {
    fetchProviders.mockRejectedValue(new Error('fail'));

    await getConfigMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
