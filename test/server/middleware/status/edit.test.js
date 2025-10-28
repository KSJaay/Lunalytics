import { createRequest, createResponse } from 'node-mocks-http';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';
import editStatusPageMiddleware from '../../../../server/middleware/status/edit.js';
import { updateStatusPage } from '../../../../server/database/queries/status.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../server/database/queries/status.js');
vi.mock('../../../../shared/validators/status/layout.js');
vi.mock('../../../../shared/validators/status/settings.js');
vi.mock('../../../../server/cache/status.js');

describe('editStatusPageMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.locals = { user: { email: 'test' } };

    updateStatusPage = vi.fn(function () {
      return Promise.resolve({ id: 'id' });
    });
    statusCache.updateStatusPage = vi.fn(function () {
      return Promise.resolve();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no statusId', async () => {
    fakeRequest.body = {
      settings: {},
      layout: [{ type: 'uptime', monitors: ['m1'] }],
    };

    await editStatusPageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toHaveProperty('message');
  });

  it('should return 400 if no monitors', async () => {
    fakeRequest.body = {
      statusId: 'id',
      settings: {},
      layout: [{ type: 'uptime', monitors: [] }],
    };

    await editStatusPageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toHaveProperty('message');
  });

  it('should update status page and return 200', async () => {
    fakeRequest.body = {
      statusId: 'id',
      settings: {},
      layout: [{ type: 'uptime', monitors: ['m1'] }],
    };

    await editStatusPageMiddleware(fakeRequest, fakeResponse);

    expect(updateStatusPage).toHaveBeenCalled();
    expect(statusCache.updateStatusPage).toHaveBeenCalled();
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toHaveProperty('message');
    expect(fakeResponse._getData()).toHaveProperty('data');
  });

  it('should call handleError if error thrown', async () => {
    updateStatusPage.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = {
      statusId: 'id',
      settings: {},
      layout: [{ type: 'uptime', monitors: ['m1'] }],
    };

    await editStatusPageMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
