/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---
// Define mocks before imports to ensure clean loading
jest.mock('../../../../server/database/queries/user.js', () => ({
  getUserByEmail: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import emailExistsMiddleware from '../../../../server/middleware/auth/emailExists.js';
import { getUserByEmail } from '../../../../server/database/queries/user.js';

describe('emailExistsMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { email: 'test@example.com' };
    
    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn().mockReturnThis();
    fakeResponse.sendStatus = jest.fn().mockReturnThis();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no email provided', async () => {
    fakeRequest.body.email = undefined;
    
    await emailExistsMiddleware(fakeRequest, fakeResponse);
    
    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No email provided');
  });

  it('should return 404 if user not found', async () => {
    getUserByEmail.mockResolvedValue(null);
    
    await emailExistsMiddleware(fakeRequest, fakeResponse);
    
    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(404);
  });

  it('should return 200 if user found', async () => {
    getUserByEmail.mockResolvedValue({ id: 1 });
    
    await emailExistsMiddleware(fakeRequest, fakeResponse);
    
    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
  });
});