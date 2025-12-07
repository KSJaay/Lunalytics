/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database (Critical: Prevents 'nanoid' ESM crash)
jest.mock('../../../../server/database/queries/invite.js', () => ({
  fetchInviteUsingId: jest.fn(),
  pauseInvite: jest.fn(),
}));

// Mock Error Handler
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import pauseInviteMiddleware from '../../../../server/middleware/invites/pause.js';
import {
  fetchInviteUsingId,
  pauseInvite,
} from '../../../../server/database/queries/invite.js';
import { handleError } from '../../../../server/utils/errors.js';

describe('pauseInviteMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { id: 'id', paused: true };
    
    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if id is missing', async () => {
    fakeRequest.body.id = undefined;

    await pauseInviteMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'No invite id provided',
    });
  });

  it('should return 404 if invite not found', async () => {
    fetchInviteUsingId.mockResolvedValue(null);

    await pauseInviteMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'Invite not found',
    });
  });

  it('should pause invite and return success', async () => {
    fetchInviteUsingId.mockResolvedValue({ id: 'id' });

    await pauseInviteMiddleware(fakeRequest, fakeResponse);
    
    expect(pauseInvite).toHaveBeenCalledWith('id', true);

    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'Invite has been paused successfully',
    });
  });

  it('should handle errors gracefully', async () => {
    fetchInviteUsingId.mockImplementation(() => {
      throw new Error('fail');
    });

    await pauseInviteMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});