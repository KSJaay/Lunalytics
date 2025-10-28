import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchNotifications } from '../../../../server/database/queries/notification.js';
import NotificationGetAllMiddleware from '../../../../server/middleware/notifications/getAll.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../server/database/queries/notification.js');

describe('NotificationGetAllMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchNotifications = vi.fn(() => Promise.resolve([{ id: 'id' }]));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch notifications and return them', async () => {
    await NotificationGetAllMiddleware(fakeRequest, fakeResponse);

    expect(fetchNotifications).toHaveBeenCalled();
    expect(fakeResponse._getJSONData()).toEqual([{ id: 'id' }]);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if fetchNotifications throws', async () => {
    fetchNotifications.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    await NotificationGetAllMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
