/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database (Critical: Prevents 'nanoid' ESM crash)
jest.mock('../../../../server/database/queries/invite.js', () => ({
  createInvite: jest.fn(),
}));

// Mock Permissions
jest.mock('../../../../shared/permissions/isValidBitFlags.js', () => ({
  isValidBitFlags: jest.fn(),
}));

// Mock Error Handler
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import createInviteMiddleware from '../../../../server/middleware/invites/create.js';
import { createInvite } from '../../../../server/database/queries/invite.js';
import { isValidBitFlags } from '../../../../shared/permissions/isValidBitFlags.js';
import { handleError } from '../../../../server/utils/errors.js';

describe('createInviteMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { expiry: 'e', limit: 1, permission: 1 };
    fakeRequest.locals = { user: { email: 'e' } };

    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn();
    fakeResponse.locals = { user: { email: 'e' } };

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if permission is invalid', async () => {
    isValidBitFlags.mockReturnValue(false);

    await createInviteMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'Invalid permission flags provided',
    });
  });

  it('should create invite and return success', async () => {
    isValidBitFlags.mockReturnValue(true);
    createInvite.mockResolvedValue('invite');

    await createInviteMiddleware(fakeRequest, fakeResponse);

    expect(createInvite).toHaveBeenCalledWith('e', 'e', 1, 1);
    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.send).toHaveBeenCalledWith({ invite: 'invite' });
  });

  it('should handle errors gracefully', async () => {
    isValidBitFlags.mockImplementation(() => {
      throw new Error('fail');
    });

    await createInviteMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});