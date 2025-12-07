/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// [NEW FIX] Mock Invite to prevent 'nanoid' crash
jest.mock('../../../../server/database/queries/invite.js', () => ({
  __esModule: true,
  default: jest.fn(),
  checkInviteCode: jest.fn(), 
}));

// Mock Session (also prevents nanoid crash)
jest.mock('../../../../server/database/queries/session.js', () => ({
  __esModule: true,
  createUserSession: jest.fn(),
}));

jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

jest.mock('../../../../shared/utils/cookies.js', () => ({
  setServerSideCookie: jest.fn(),
}));

jest.mock('../../../../server/utils/uaParser.js', () => ({
  parseUserAgent: jest.fn(),
}));

jest.mock('../../../../server/database/queries/user.js', () => ({
  getUserByEmail: jest.fn(),
  registerSsoUser: jest.fn(),
}));

jest.mock('../../../../server/database/queries/connection.js', () => ({
  fetchConnectionByEmail: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import {
  getUserByEmail,
  registerSsoUser,
} from '../../../../server/database/queries/user.js';
import { handleError } from '../../../../server/utils/errors.js';
import { parseUserAgent } from '../../../../server/utils/uaParser.js';
import { createUserSession } from '../../../../server/database/queries/session.js';
import { fetchConnectionByEmail } from '../../../../server/database/queries/connection.js';
// The import below will now skip loading the real invite.js (and nanoid)
import signInOrRegisterUsingAuth from '../../../../server/middleware/auth/signInOrRegisterUsingAuth.js';

describe('signInOrRegisterUsingAuth', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.headers = { 'user-agent': 'test-agent' };
    fakeRequest.protocol = 'http';

    fakeResponse.locals = {
      authUser: {
        avatar: 'a',
        id: 'id',
        username: 'user',
        email: 'test@example.com',
        provider: 'google',
      },
    };

    // Spies
    fakeResponse.redirect = jest.fn().mockReturnThis();
    fakeResponse.json = jest.fn().mockReturnThis();
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn().mockReturnThis();
    fakeResponse.sendStatus = jest.fn().mockReturnThis();

    // Default Mock Behaviors
    parseUserAgent.mockReturnValue({ device: 'dev', data: {} });
    createUserSession.mockResolvedValue('token');
    
    handleError.mockImplementation((error, res) => {
      if (res && res.json) res.json({ error: error.message });
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetchConnectionByEmail with correct params', async () => {
    fetchConnectionByEmail.mockResolvedValue(null);
    getUserByEmail.mockResolvedValue(null);
    registerSsoUser.mockResolvedValue(null);

    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);

    expect(fetchConnectionByEmail).toHaveBeenCalledWith('google', 'id');
  });

  it('should redirect to /home if user is verified', async () => {
    fetchConnectionByEmail.mockResolvedValue(true);
    getUserByEmail.mockResolvedValue({ isVerified: true });
    
    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);
    
    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });

  it('should redirect to /verify if user is not verified', async () => {
    fetchConnectionByEmail.mockResolvedValue(true);
    getUserByEmail.mockResolvedValue({ isVerified: false });
    
    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);
    
    expect(fakeResponse.redirect).toHaveBeenCalledWith('/verify');
  });

  it('should handle errors gracefully', async () => {
    fetchConnectionByEmail.mockRejectedValue(new Error('fail'));

    await signInOrRegisterUsingAuth(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});