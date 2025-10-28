import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchProviders } from '../../../../server/database/queries/provider.js';
import getAllProvidersMiddleware from '../../../../server/middleware/provider/getAll.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../server/database/queries/provider.js');

describe('getAllProvidersMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchProviders = vi.fn(() => Promise.resolve([{ provider: 'github' }]));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch providers and return them', async () => {
    await getAllProvidersMiddleware(fakeRequest, fakeResponse);

    expect(fetchProviders).toHaveBeenCalled();
    expect(fakeResponse._getJSONData()).toEqual([{ provider: 'github' }]);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if fetchProviders throws', async () => {
    fetchProviders.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    await getAllProvidersMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
