import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import getUsingIdMiddleware from '../../../../server/middleware/status/getUsingId.js';
import { fetchStatusPageUsingUrl } from '../../../../server/database/queries/status.js';

vi.mock('../../../../server/database/queries/status.js');
vi.mock('../../../../server/utils/errors.js');

describe('getUsingIdMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchStatusPageUsingUrl = vi.fn(function (id) {
      return id === 'exists' ? { id: 'exists' } : null;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 if no statusPageId', async () => {
    fakeRequest.query = {};

    await getUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(404);
  });

  it('should return 404 if not found', async () => {
    fakeRequest.query = { statusPageId: 'notfound' };

    await getUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(404);
  });

  it('should return 200 and cleaned status page if found', async () => {
    fakeRequest.query = { statusPageId: 'exists' };

    await getUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getJSONData()).toMatchObject({ id: 'exists' });
  });

  it('should call handleError if error thrown', async () => {
    fetchStatusPageUsingUrl.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.query = { statusPageId: 'exists' };

    await getUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
