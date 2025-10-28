import { createRequest, createResponse } from 'node-mocks-http';
import {
  createProvider,
  fetchProvider,
  updateProvider,
} from '../../../../server/database/queries/provider.js';
import { handleError } from '../../../../server/utils/errors.js';
import ProviderValidator from '../../../../shared/validators/provider.js';
import configureProviderMiddleware from '../../../../server/middleware/provider/configure.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../server/database/queries/provider.js');
vi.mock('../../../../shared/validators/provider.js');

describe('configureProviderMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.locals = { user: { email: 'test@example.com' } };

    ProviderValidator = vi.fn(function () {
      return false;
    });
    createProvider = vi.fn(function () {
      return Promise.resolve();
    });
    fetchProvider = vi.fn(function () {
      return null;
    });
    updateProvider = vi.fn(function () {
      return Promise.resolve();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if validation fails', async () => {
    ProviderValidator.mockReturnValueOnce('invalid');
    fakeRequest.body = {
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
      data: {},
    };

    await configureProviderMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getJSONData()).toEqual({ error: 'invalid' });
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should update provider if exists', async () => {
    fetchProvider.mockResolvedValueOnce(true);
    fakeRequest.body = {
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
      data: { foo: 'bar' },
    };

    await configureProviderMiddleware(fakeRequest, fakeResponse);

    expect(updateProvider).toHaveBeenCalledWith(
      'github',
      expect.objectContaining({ provider: 'github' })
    );
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getJSONData()).toEqual(
      expect.objectContaining({ provider: 'github' })
    );
  });

  it('should create provider if not exists', async () => {
    fetchProvider.mockResolvedValueOnce(false);
    fakeRequest.body = {
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
      data: { foo: 'bar' },
    };

    await configureProviderMiddleware(fakeRequest, fakeResponse);

    expect(createProvider).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'github' })
    );
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getJSONData()).toEqual(
      expect.objectContaining({ provider: 'github' })
    );
  });

  it('should call handleError if error thrown', async () => {
    fetchProvider.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.body = {
      provider: 'github',
      clientId: 'id',
      clientSecret: 'secret',
      data: {},
    };

    await configureProviderMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
