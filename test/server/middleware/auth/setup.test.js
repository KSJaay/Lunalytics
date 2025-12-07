/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// [NEW] Mock Session to avoid 'nanoid' ESM crash
jest.mock('../../../../server/database/queries/session.js', () => ({
  __esModule: true,
  // Mock any functions exported by session.js that setup.js might use
  createUserSession: jest.fn(),
  getUniqueSessionId: jest.fn(),
}));

jest.mock('../../../../server/utils/config.js', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../server/database/queries/user.js', () => ({
  ownerExists: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import setupMiddleware from '../../../../server/middleware/auth/setup.js';
import config from '../../../../server/utils/config.js';
import { ownerExists } from '../../../../server/database/queries/user.js';

describe('setupMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = {
      type: 'basic',
      email: 'test@example.com',
      username: 'user',
      password: 'pass',
      databaseType: 'sqlite',
      databaseName: 'db',
      websiteUrl: 'http://localhost',
      migrationType: 'none',
    };

    fakeRequest.headers = { 'user-agent': 'test-agent' };
    fakeRequest.protocol = 'http';

    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn().mockReturnThis();
    fakeResponse.sendStatus = jest.fn().mockReturnThis();

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for invalid setup type', async () => {
    fakeRequest.body.type = 'invalid';

    await setupMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      general: 'Invalid setup type',
    });
  });

  it('should return 400 if database and owner exists', async () => {
    config.get.mockReturnValue({ name: 'db' });
    ownerExists.mockResolvedValue(true);

    await setupMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({ errorType: 'ownerExists' })
    );
  });
});