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
    Slack: jest.fn(),
  },
}));

// Mock Database Queries
jest.mock('../../../../server/database/queries/notification.js', () => ({
  editNotification: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import NotificationEditMiddleware from '../../../../server/middleware/notifications/edit.js';
import { handleError } from '../../../../server/utils/errors.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';
import { editNotification } from '../../../../server/database/queries/notification.js';
import NotificationValidators from '../../../../shared/validators/notifications/index.js';

describe('NotificationEditMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Default DB Success
    editNotification.mockResolvedValue({
      id: 'id',
      email: 'test',
      isEnabled: true,
    });

    // Default Validator Behavior
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

    // FIX: Parse the stringified JSON response
    const data = JSON.parse(response._getData());
    
    expect(data).toEqual(
      expect.objectContaining({ id: 'id' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if editNotification throws', async () => {
    editNotification.mockRejectedValueOnce(new Error('fail'));

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