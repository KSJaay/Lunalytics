/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database (Critical: Prevents 'nanoid' ESM crash)
jest.mock('../../../../server/database/queries/invite.js', () => ({
  fetchAllInvites: jest.fn(),
}));

// Mock Error Handler
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import getAllInvitesMiddleware from '../../../../server/middleware/invites/getAll.js';
import { fetchAllInvites } from '../../../../server/database/queries/invite.js';
import { handleError } from '../../../../server/utils/errors.js';

describe('getAllInvitesMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return invites on success', async () => {
    fetchAllInvites.mockResolvedValue([{ id: 1 }]);

    await getAllInvitesMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.send).toHaveBeenCalledWith({ invites: [{ id: 1 }] });
  });

  it('should handle errors gracefully', async () => {
    // Force Error
    fetchAllInvites.mockImplementation(() => {
      throw new Error('fail');
    });

    await getAllInvitesMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});