import { createRequest, createResponse } from 'node-mocks-http';
import logger from '../../../../server/utils/logger.js';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchNotificationById } from '../../../../server/database/queries/notification.js';
import NotificationGetUsingIdMiddleware from '../../../../server/middleware/notifications/getUsingId.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../server/database/queries/notification.js');
vi.mock('../../../../server/utils/logger.js');

describe('NotificationGetUsingIdMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchNotificationById = vi.fn((id) =>
      id === 'exists' ? { id: 'exists' } : null
    );

    logger.error = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 and notification if found', async () => {
    fakeRequest.query = { notificationId: 'exists' };

    await NotificationGetUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(fetchNotificationById).toHaveBeenCalledWith('exists');
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toEqual({ id: 'exists' });
    expect(logger.error).not.toHaveBeenCalled();
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should return 404 and log error if not found', async () => {
    fakeRequest.query = { notificationId: 'notfound' };
    await NotificationGetUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(fetchNotificationById).toHaveBeenCalledWith('notfound');
    expect(fakeResponse._getStatusCode()).toBe(404);
    expect(fakeResponse._getData()).toEqual({
      message: 'Notification not found',
    });
    expect(logger.error).toHaveBeenCalledWith(
      'Notification - getById',
      expect.objectContaining({ notificationId: 'notfound' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if fetchNotificationById throws', async () => {
    fetchNotificationById.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.query = { notificationId: 'exists' };

    await NotificationGetUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
