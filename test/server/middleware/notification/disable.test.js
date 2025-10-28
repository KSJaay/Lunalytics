import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { toggleNotification } from '../../../../server/database/queries/notification.js';
import NotificationToggleMiddleware from '../../../../server/middleware/notifications/disable.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../shared/utils/errors.js');
vi.mock('../../../../server/database/queries/notification.js');

describe('NotificationToggleMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw if notificationId is missing', async () => {
    fakeRequest.query = { isEnabled: 'true' };
    await NotificationToggleMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should throw if isEnabled is not boolean', async () => {
    fakeRequest.query = { notificationId: 'id', isEnabled: 'maybe' };

    await NotificationToggleMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should toggle notification and return 200', async () => {
    fakeRequest.query = { notificationId: 'id', isEnabled: 'true' };

    const response = await NotificationToggleMiddleware(
      fakeRequest,
      fakeResponse
    );

    expect(toggleNotification).toHaveBeenCalledWith('id', true);
    expect(response._getStatusCode()).toBe(200);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if toggleNotification throws', async () => {
    toggleNotification.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.query = { notificationId: 'id', isEnabled: 'true' };

    await NotificationToggleMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
