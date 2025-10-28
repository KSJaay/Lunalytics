import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { deleteNotification } from '../../../../server/database/queries/notification.js';
import NotificationDeleteMiddleware from '../../../../server/middleware/notifications/delete.js';
import { afterEach } from 'vitest';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../shared/utils/errors.js');
vi.mock('../../../../server/database/queries/notification.js');

describe('NotificationDeleteMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { notificationId: 'id' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw if notificationId is missing', async () => {
    fakeRequest.query = {};

    await NotificationDeleteMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should delete notification and return 200', async () => {
    const response = await NotificationDeleteMiddleware(
      fakeRequest,
      fakeResponse
    );

    expect(deleteNotification).toHaveBeenCalledWith('id');

    expect(response._getStatusCode()).toBe(200);
    expect(response._getData()).toBe('Notification deleted');
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if deleteNotification throws', async () => {
    deleteNotification.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    await NotificationDeleteMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
