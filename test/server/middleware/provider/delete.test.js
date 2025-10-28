import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { deleteProvider } from '../../../../server/database/queries/provider.js';
import deleteProviderMiddleware from '../../../../server/middleware/provider/delete.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../server/database/queries/provider.js');

describe('deleteProviderMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    deleteProvider = vi.fn(function () {
      return Promise.resolve();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call deleteProvider with provider from body', async () => {
    fakeRequest.body = { provider: 'github' };

    await deleteProviderMiddleware(fakeRequest, fakeResponse);

    expect(deleteProvider).toHaveBeenCalledWith('github');
  });

  it('should call handleError if error thrown', async () => {
    deleteProvider.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.body = { provider: 'github' };

    await deleteProviderMiddleware(fakeRequest, fakeResponse);
    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
