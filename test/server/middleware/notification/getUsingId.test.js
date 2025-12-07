/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Server Errors
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// Mock Database Queries
jest.mock('../../../../server/database/queries/notification.js', () => ({
  fetchNotificationById: jest.fn(),
}));

// Mock Logger
jest.mock('../../../../server/utils/logger.js', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import NotificationGetUsingIdMiddleware from '../../../../server/middleware/notifications/getUsingId.js';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchNotificationById } from '../../../../server/database/queries/notification.js';
import logger from '../../../../server/utils/logger.js';

describe('NotificationGetUsingIdMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Replicate logic: Return object if id is 'exists', else null
    // Must return a Promise because DB queries are async
    fetchNotificationById.mockImplementation((id) => {
      return Promise.resolve(id === 'exists' ? { id: 'exists' } : null);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and notification if found', async () => {
    fakeRequest.query = { notificationId: 'exists' };

    await NotificationGetUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(fetchNotificationById).toHaveBeenCalledWith('exists');
    expect(fakeResponse.statusCode).toBe(200);

    // FIX: Do NOT use JSON.parse here. _getData() is already the object.
    const data = fakeResponse._getData();
    expect(data).toEqual({ id: 'exists' });
    
    expect(logger.error).not.toHaveBeenCalled();
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should return 404 and log error if not found', async () => {
    fakeRequest.query = { notificationId: 'notfound' };
    
    await NotificationGetUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(fetchNotificationById).toHaveBeenCalledWith('notfound');
    expect(fakeResponse.statusCode).toBe(404);

    // FIX: Do NOT use JSON.parse here.
    const data = fakeResponse._getData();
    expect(data).toEqual({
      message: 'Notification not found',
    });

    expect(logger.error).toHaveBeenCalledWith(
      'Notification - getById',
      expect.objectContaining({ notificationId: 'notfound' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if fetchNotificationById throws', async () => {
    // Simulate Async DB Failure
    fetchNotificationById.mockRejectedValueOnce(new Error('fail'));

    fakeRequest.query = { notificationId: 'exists' };

    await NotificationGetUsingIdMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});