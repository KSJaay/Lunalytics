import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchAllStatusPages } from '../../../../server/database/queries/status.js';
import getAllStatusPagesMiddleware from '../../../../server/middleware/status/getAll.js';

vi.mock('../../../../server/database/queries/status.js');
vi.mock('../../../../server/utils/errors.js');

describe('getAllStatusPagesMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchAllStatusPages = vi.fn(() => Promise.resolve([{ id: 'id' }]));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all status pages and return them', async () => {
    await getAllStatusPagesMiddleware(fakeRequest, fakeResponse);

    expect(fetchAllStatusPages).toHaveBeenCalled();
    expect(fakeResponse._getJSONData()).toEqual([{ id: 'id' }]);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if fetchAllStatusPages throws', async () => {
    fetchAllStatusPages.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    await getAllStatusPagesMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
