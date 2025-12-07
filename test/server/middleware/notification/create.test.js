/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Shared Errors
jest.mock('../../../../shared/utils/errors.js', () => ({
  UnprocessableError: class MockUnprocessableError extends Error {},
}));

// Mock Server Errors
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// Mock Validators
jest.mock('../../../../shared/validators/notifications/index.js', () => ({
  __esModule: true,
  default: {
    Discord: jest.fn(),
    Slack: jest.fn(),
  },
}));

// Mock Database Queries
jest.mock('../../../../server/database/queries/notification.js', () => ({
  createNotification: jest.fn(),
}));

// Mock Random ID
jest.mock('../../../../server/utils/randomId.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import NotificationCreateMiddleware from '../../../../server/middleware/notifications/create.js';
import randomId from '../../../../server/utils/randomId.js';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { createNotification } from '../../../../server/database/queries/notification.js';
import NotificationValidators from '../../../../shared/validators/notifications/index.js';

describe('NotificationCreateMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeResponse.locals = { user: { email: 'test' } };

    // DB is async -> use mockResolvedValue
    createNotification.mockResolvedValue({
      id: 'uniqueId',
      email: 'test',
      isEnabled: true,
    });

    // Utils are sync -> use mockReturnValue
    randomId.mockReturnValue('uniqueId');

    // Validator should pass by default
    NotificationValidators.Discord.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    await NotificationCreateMiddleware(fakeRequest, fakeResponse);

    // 1. Validate inputs were checked
    expect(NotificationValidators.Discord).toHaveBeenCalled();

    // 2. Validate DB call
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'uniqueId',
        email: 'test',
        isEnabled: true,
      })
    );

    // 3. Validate Response Status
    expect(fakeResponse.statusCode).toBe(201);
    
    // --- FIX IS HERE: Use _getData() instead of _getJSONData() ---
    const data = fakeResponse._getData(); 
    expect(data).toEqual(
      expect.objectContaining({ id: 'uniqueId' })
    );

    // 4. Ensure no error handler was called
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if createNotification throws', async () => {
    createNotification.mockRejectedValueOnce(new Error('fail'));
    
    fakeRequest.body = { platform: 'Discord', data: {} };
    
    await NotificationCreateMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
    expect(fakeResponse.statusCode).not.toBe(201);
  });
});