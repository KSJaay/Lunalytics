/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// --- MOCKS ---

// Mock Logger
jest.mock('../../../server/utils/logger.js', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// Mock Custom Errors (Factory Pattern)
// We define them as real classes here so 'instanceof' works in the source code
jest.mock('../../../shared/utils/errors.js', () => ({
  AuthorizationError: class AuthorizationError extends Error {},
  ConflictError: class ConflictError extends Error {},
  UnprocessableError: class UnprocessableError extends Error {},
  NotificationValidatorError: class NotificationValidatorError extends Error {
    constructor(key, message) {
      super(message);
      this.key = key;
    }
  },
}));

// --- IMPORTS ---
import { handleError } from '../../../server/utils/errors.js'; // Adjust path if needed
import logger from '../../../server/utils/logger.js';
import {
  AuthorizationError,
  ConflictError,
  UnprocessableError,
  NotificationValidatorError,
} from '../../../shared/utils/errors.js';

describe('Error Handler Utility', () => {
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock Response object that supports chaining .status().send()
    mockRes = {
      headersSent: false,
      status: jest.fn().mockReturnThis(), // Return 'this' to allow .send()
      send: jest.fn(),
    };
  });

  it('should always log the error', () => {
    const error = new Error('Test Error');
    handleError(error, mockRes);

    expect(logger.error).toHaveBeenCalledWith('Error handler', {
      error: 'Test Error',
      stack: expect.any(String),
    });
  });

  it('should return 401 for AuthorizationError', () => {
    const error = new AuthorizationError('Unauthorized access');
    handleError(error, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Unauthorized access',
    });
  });

  it('should return 409 for ConflictError', () => {
    const error = new ConflictError('Resource exists');
    handleError(error, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Resource exists',
    });
  });

  it('should return 422 for UnprocessableError', () => {
    const error = new UnprocessableError('Invalid input');
    handleError(error, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Invalid input',
    });
  });

  it('should return 422 with dynamic key for NotificationValidatorError', () => {
    // Determine constructor arguments based on how your mock is defined above
    // Assuming constructor(key, message) or similar based on usage
    const error = new NotificationValidatorError('email', 'Invalid email address');
    // Manually ensure properties are set if constructor signature differs in real code
    error.key = 'email';
    error.message = 'Invalid email address';

    handleError(error, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    // Check for dynamic key interpolation: { email: 'Invalid email address' }
    expect(mockRes.send).toHaveBeenCalledWith({
      email: 'Invalid email address',
    });
  });

  it('should return 500 for generic/unknown errors', () => {
    const error = new Error('Unexpected crash');
    handleError(error, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Something went wrong',
    });
  });

  it('should NOT send a response if headers have already been sent', () => {
    // Simulate headers already sent
    mockRes.headersSent = true;

    const error = new Error('Some error');
    handleError(error, mockRes);

    // Logger should still run
    expect(logger.error).toHaveBeenCalled();
    
    // Status and Send should NOT run
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
  });
});