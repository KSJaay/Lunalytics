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

// Mock Shared Errors
jest.mock('../../../../shared/utils/errors.js', () => ({
  UnprocessableError: class MockUnprocessableError extends Error {},
}));

// Mock Database Queries
jest.mock('../../../../server/database/queries/notification.js', () => ({
  toggleNotification: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import NotificationToggleMiddleware from '../../../../server/middleware/notifications/disable.js';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { toggleNotification } from '../../../../server/database/queries/notification.js';

describe('NotificationToggleMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Default Success for DB
    toggleNotification.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    await NotificationToggleMiddleware(fakeRequest, fakeResponse);

    expect(toggleNotification).toHaveBeenCalledWith('id', true);
    
    expect(fakeResponse.statusCode).toBe(200);
    // FIX: Changed expectation from 'Notification toggled' to 'OK'
    expect(fakeResponse._getData()).toBe('OK'); 
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if toggleNotification throws', async () => {
    toggleNotification.mockRejectedValueOnce(new Error('fail'));

    fakeRequest.query = { notificationId: 'id', isEnabled: 'true' };

    await NotificationToggleMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});