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

// Mock Validators
jest.mock('../../../../shared/validators/notifications/index.js', () => ({
  __esModule: true,
  default: {
    Discord: jest.fn(),
  },
}));

// Mock Notification Services (The classes/functions used to send alerts)
jest.mock('../../../../server/notifications/index.js', () => ({
  __esModule: true,
  default: {
    Discord: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import NotificationTestMiddleware from '../../../../server/middleware/notifications/test.js';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import NotificationServices from '../../../../server/notifications/index.js';
import NotificationValidators from '../../../../shared/validators/notifications/index.js';

describe('NotificationTestMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // 1. Setup Service Mock
    // When "new NotificationServices.Discord()" is called, return an object with a test() method
    NotificationServices.Discord.mockImplementation(() => ({
      test: jest.fn().mockResolvedValue(true), // Async success
    }));

    // 2. Setup Validator Mock
    NotificationValidators.Discord.mockImplementation((data) => ({
      ...data,
      platform: 'Discord',
      valid: true,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleError if platform is invalid', async () => {
    // 'invalid' key does not exist in our mocked Validators object
    fakeRequest.body = { platform: 'invalid' };

    await NotificationTestMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(
      expect.any(UnprocessableError),
      fakeResponse
    );
  });

  it('should call handleError if service class is missing', async () => {
    // Force validator to return a platform that doesn't exist in NotificationServices
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
    
    expect(fakeResponse.statusCode).toBe(200);
    // Assuming res.send('...') is used, _getData() returns the string directly
    expect(fakeResponse._getData()).toBe('Test notification sent');
    
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if service.test throws', async () => {
    // Simulate Service Failure
    NotificationServices.Discord.mockImplementationOnce(() => ({
      test: jest.fn().mockRejectedValue(new Error('fail')),
    }));

    fakeRequest.body = { platform: 'Discord', data: {} };

    await NotificationTestMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});