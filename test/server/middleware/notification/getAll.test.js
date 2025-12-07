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
  fetchNotifications: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import NotificationGetAllMiddleware from '../../../../server/middleware/notifications/getAll.js';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchNotifications } from '../../../../server/database/queries/notification.js';

describe('NotificationGetAllMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Default Success (Async)
    fetchNotifications.mockResolvedValue([{ id: 'id' }]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch notifications and return them', async () => {
    await NotificationGetAllMiddleware(fakeRequest, fakeResponse);

    expect(fetchNotifications).toHaveBeenCalled();

    // FIX: Parse the stringified JSON response
    const data = JSON.parse(fakeResponse._getData());
    expect(data).toEqual([{ id: 'id' }]);
    
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if fetchNotifications throws', async () => {
    // Simulate Async Failure
    fetchNotifications.mockRejectedValueOnce(new Error('fail'));

    await NotificationGetAllMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});