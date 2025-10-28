import { createRequest, createResponse } from 'node-mocks-http';
import config from '../../../../../server/utils/config.js';
import { handleError } from '../../../../../server/utils/errors.js';
import ConfigValidator from '../../../../../shared/validators/config.js';
import { fetchProviders } from '../../../../../server/database/queries/provider.js';
import updateConfigMiddleware from '../../../../../server/middleware/auth/config/update.js';

vi.mock('../../../../../shared/validators/config.js');
vi.mock('../../../../../server/database/queries/provider.js');
vi.mock('../../../../../server/utils/config.js');
vi.mock('../../../../../server/utils/errors.js');

describe('updateConfigMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { nativeSignin: true, register: true };
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.json = vi.fn().mockReturnThis();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if ConfigValidator returns string error', async () => {
    ConfigValidator.mockReturnValue('error');

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ error: 'error' });
  });

  it('should return 400 if nativeSignin is false and SSO not enabled', async () => {
    ConfigValidator.mockReturnValue({ nativeSignin: false });
    fetchProviders.mockResolvedValue([{ enabled: false }]);

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error:
        'SSO is not enabled, please enable that before turning off native signin',
    });
  });

  it('should set config and return success if valid', async () => {
    ConfigValidator.mockReturnValue({ nativeSignin: true, register: true });

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    expect(config.set).toHaveBeenCalledWith('nativeSignin', true);
    expect(config.set).toHaveBeenCalledWith('register', true);
    expect(fakeResponse.json).toHaveBeenCalledWith({ success: true });
  });

  it('should handle errors gracefully', async () => {
    ConfigValidator.mockImplementation(() => {
      throw new Error('fail');
    });

    await updateConfigMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
