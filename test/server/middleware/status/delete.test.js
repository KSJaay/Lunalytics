import { createRequest, createResponse } from 'node-mocks-http';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';
import { deleteStatusPage } from '../../../../server/database/queries/status.js';
import deleteStatusPageMiddleware from '../../../../server/middleware/status/delete.js';

vi.mock('../../../../server/cache/status.js');
vi.mock('../../../../server/database/queries/status.js');
vi.mock('../../../../server/utils/errors.js');

describe('deleteStatusPageMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    deleteStatusPage = vi.fn(function () {
      return Promise.resolve();
    });
    statusCache.deleteStatusPage = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no statusPageId', async () => {
    fakeRequest.body = {};
    await deleteStatusPageMiddleware(fakeRequest, fakeResponse);
    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toHaveProperty('message');
  });

  it('should delete status page and return 200', async () => {
    fakeRequest.body = { statusPageId: 'id' };
    await deleteStatusPageMiddleware(fakeRequest, fakeResponse);
    expect(deleteStatusPage).toHaveBeenCalledWith('id');
    expect(statusCache.deleteStatusPage).toHaveBeenCalledWith('id');
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toHaveProperty('message');
  });

  it('should call handleError if error thrown', async () => {
    deleteStatusPage.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { statusPageId: 'id' };
    await deleteStatusPageMiddleware(fakeRequest, fakeResponse);
    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
