import { createRequest, createResponse } from 'node-mocks-http';
import randomId from '../../../../server/utils/randomId.js';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { createNotification } from '../../../../server/database/queries/notification.js';
import NotificationValidators from '../../../../shared/validators/notifications/index.js';
import NotificationCreateMiddleware from '../../../../server/middleware/notifications/create.js';

vi.mock('../../../../shared/utils/errors.js');
vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../shared/validators/notifications/index.js');
vi.mock('../../../../server/database/queries/notification.js');
vi.mock('../../../../server/utils/randomId.js');

describe('NotificationCreateMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeResponse.locals = { user: { email: 'test' } };

    createNotification.mockReturnValue({
      id: 'uniqueId',
      email: 'test',
      isEnabled: true,
    });

    handleError = vi.fn();
    NotificationValidators.Discord = vi.fn();
    randomId.mockReturnValue('uniqueId');
  });

  afterEach(() => vi.clearAllMocks());

  it('should call handleError if platform is invalid', async () => {
    fakeRequest.body = { platform: 'invalid' };

    await NotificationCreateMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should create notification and return 201', async () => {
    fakeRequest.body = { platform: 'Discord', data: { foo: 'bar' } };

    const response = await NotificationCreateMiddleware(
      fakeRequest,
      fakeResponse
    );

    expect(NotificationValidators.Discord).toHaveBeenCalled();
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'uniqueId',
        email: 'test',
        isEnabled: true,
      })
    );
    expect(response._getStatusCode()).toBe(201);
    expect(response._getData()).toEqual(
      expect.objectContaining({ id: expect.any(String) })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if createNotification throws', async () => {
    createNotification.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { platform: 'Discord', data: {} };
    await NotificationCreateMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
