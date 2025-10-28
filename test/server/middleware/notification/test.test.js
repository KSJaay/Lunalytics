import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import NotificationServices from '../../../../server/notifications/index.js';
import NotificationValidators from '../../../../shared/validators/notifications/index.js';
import NotificationTestMiddleware from '../../../../server/middleware/notifications/test.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../shared/utils/errors.js');
vi.mock('../../../../shared/validators/notifications/index.js');
vi.mock('../../../../server/notifications/index.js');

describe('NotificationTestMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    NotificationServices.Discord = vi.fn().mockImplementation(function () {
      return {
        test: vi.fn(function () {
          return Promise.resolve();
        }),
      };
    });

    NotificationValidators.Discord = vi.fn(function (data) {
      return {
        ...data,
        platform: 'Discord',
        valid: true,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call handleError if platform is invalid', async () => {
    fakeRequest.body = { platform: 'invalid' };

    await NotificationTestMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should call handleError if service class is missing', async () => {
    NotificationValidators.Discord.mockReturnValueOnce({
      platform: 'notfound',
    });

    fakeRequest.body = { platform: 'Discord', data: {} };

    await NotificationTestMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should test notification and return 200', async () => {
    fakeRequest.body = { platform: 'Discord', data: {} };

    await NotificationTestMiddleware(fakeRequest, fakeResponse);

    expect(NotificationValidators.Discord).toHaveBeenCalled();
    expect(NotificationServices.Discord).toHaveBeenCalled();
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toBe('Test notification sent');
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if service.test throws', async () => {
    NotificationServices.Discord.mockImplementationOnce(() => ({
      test: vi.fn(function () {
        throw new Error('fail');
      }),
    }));

    fakeRequest.body = { platform: 'Discord', data: {} };

    await NotificationTestMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
