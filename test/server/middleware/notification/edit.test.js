import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { editNotification } from '../../../../server/database/queries/notification.js';
import NotificationValidators from '../../../../shared/validators/notifications/index.js';
import NotificationEditMiddleware from '../../../../server/middleware/notifications/edit.js';

vi.mock('../../../../server/utils/errors.js');
vi.mock('../../../../shared/utils/errors.js');
vi.mock('../../../../shared/validators/notifications/index.js');
vi.mock('../../../../server/database/queries/notification.js');

describe('NotificationEditMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    editNotification = vi.fn(() =>
      Promise.resolve({ id: 'id', email: 'test', isEnabled: true })
    );

    NotificationValidators.Discord = vi.fn((data) => ({
      ...data,
      platform: 'Discord',
      valid: true,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call handleError if platform is invalid', async () => {
    fakeRequest.body = { platform: 'invalid' };

    await NotificationEditMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should edit notification and return result', async () => {
    fakeRequest.body = {
      platform: 'Discord',
      data: { foo: 'bar' },
      id: 'id',
      email: 'test',
      isEnabled: true,
    };

    const response = await NotificationEditMiddleware(
      fakeRequest,
      fakeResponse
    );

    expect(NotificationValidators.Discord).toHaveBeenCalled();
    expect(editNotification).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'id', email: 'test', isEnabled: true })
    );
    expect(response._getJSONData()).toEqual(
      expect.objectContaining({ id: 'id' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if editNotification throws', async () => {
    editNotification.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.body = {
      platform: 'Discord',
      data: {},
      id: 'id',
      email: 'test',
      isEnabled: true,
    };

    await NotificationEditMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
