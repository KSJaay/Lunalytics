/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Shared Errors (Class needs to be mocked to use expect.any)
jest.mock('../../../../shared/utils/errors.js', () => ({
  UnprocessableError: class MockUnprocessableError extends Error {},
}));

// Mock Server Errors
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// Mock Database Queries
jest.mock('../../../../server/database/queries/notification.js', () => ({
  deleteNotification: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import NotificationDeleteMiddleware from '../../../../server/middleware/notifications/delete.js';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { deleteNotification } from '../../../../server/database/queries/notification.js';

describe('NotificationDeleteMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { notificationId: 'id' };

    // Default success for DB (Async)
    deleteNotification.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    await NotificationDeleteMiddleware(fakeRequest, fakeResponse);

    expect(deleteNotification).toHaveBeenCalledWith('id');

    expect(fakeResponse.statusCode).toBe(200);
    expect(fakeResponse._getData()).toBe('Notification deleted');
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if deleteNotification throws', async () => {
    // Simulate Async DB Failure
    deleteNotification.mockRejectedValueOnce(new Error('fail'));

    await NotificationDeleteMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});