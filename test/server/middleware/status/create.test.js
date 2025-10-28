import { createRequest, createResponse } from 'node-mocks-http';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';
import { createStatusPage } from '../../../../server/database/queries/status.js';
import createStatusPageMiddleware from '../../../../server/middleware/status/create.js';

vi.mock('../../../../shared/utils/errors.js');
vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../server/database/queries/status.js');
vi.mock('../../../../shared/validators/status/layout.js');
vi.mock('../../../../shared/validators/status/settings.js');
vi.mock('../../../../server/cache/status.js');

describe('createStatusPageMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeResponse.locals = { user: { email: 'test' } };

    statusCache.addNewStatusPage = vi.fn(function () {
      return Promise.resolve();
    });
    createStatusPage = vi.fn(function () {
      return Promise.resolve({ id: 'id' });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no monitors', async () => {
    fakeRequest.body = {
      settings: {},
      layout: [{ type: 'uptime', monitors: [] }],
    };

    await createStatusPageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toHaveProperty('message');
  });

  it('should create status page and return 200', async () => {
    fakeRequest.body = {
      settings: {},
      layout: [{ type: 'uptime', monitors: ['m1'] }],
    };

    await createStatusPageMiddleware(fakeRequest, fakeResponse);

    expect(createStatusPage).toHaveBeenCalled();
    expect(statusCache.addNewStatusPage).toHaveBeenCalled();
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toHaveProperty('message');
    expect(fakeResponse._getData()).toHaveProperty('data');
  });

  it('should call handleError if error thrown', async () => {
    createStatusPage.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.body = {
      settings: {},
      layout: [{ type: 'uptime', monitors: ['m1'] }],
    };

    await createStatusPageMiddleware(fakeRequest, fakeResponse);
    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
