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
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { code: 'abc' };
    fakeResponse.redirect = vi.fn();
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.send = vi.fn();
    fakeResponse.locals = {};
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no code provided', async () => {
    fakeRequest.query.code = undefined;

    await customCallback(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No code provided');
  });

  it('should redirect if provider not found', async () => {
    fetchProvider.mockResolvedValue(null);

    await customCallback(fakeRequest, fakeResponse);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/auth/error');
  });

  it('should send userInfo if provider and code are valid', async () => {
    fetchProvider.mockResolvedValue({
      provider: 'custom',
      clientId: 'id',
      clientSecret: 'secret',
    });

    config.get.mockReturnValue('https://site.com');
    axios.post.mockResolvedValue({ data: { access_token: 'token' } });
    axios.get.mockResolvedValue({ data: { id: 'i', email: 'e' } });

    await customCallback(fakeRequest, fakeResponse);

    expect(fakeResponse.send).toHaveBeenCalledWith({ id: 'i', email: 'e' });
  });
});
