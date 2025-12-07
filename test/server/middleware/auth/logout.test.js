/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS ---
// Mock the cookies utility before importing it
jest.mock('../../../../shared/utils/cookies.js', () => ({
  deleteCookie: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import logout from '../../../../server/middleware/auth/logout.js';
import { deleteCookie } from '../../../../shared/utils/cookies.js';
import { createURL } from '../../../../shared/utils/url.js';

describe('Logout - Middleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Spy on the redirect method
    fakeResponse.redirect = jest.fn();

    // Clear mock history
    jest.clearAllMocks();
  });

  it('should call deleteCookie with response and "session_token"', async () => {
    await logout(fakeRequest, fakeResponse);

    expect(deleteCookie).toHaveBeenCalledWith(fakeResponse, 'session_token');
  });

  it('should redirect to /login', async () => {
    await logout(fakeRequest, fakeResponse);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(createURL('/login'));
  });
});