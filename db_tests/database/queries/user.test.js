const mockFirst = jest.fn();
const mockSelect = jest.fn(() => ({ first: mockFirst }));
const mockUpdate = jest.fn(() => Promise.resolve(1));
const mockInsert = jest.fn(() => Promise.resolve([1]));
const mockDel = jest.fn(() => Promise.resolve(1));

const mockWhere = jest.fn(() => ({
  first: mockFirst,
  update: mockUpdate,
  select: mockSelect,
  insert: mockInsert,
  del: mockDel,
}));

// --- Mock SQLite default export inside a factory function ---
jest.mock('../../../server/database/sqlite/setup.js', () => ({
  __esModule: true,
  default: {
    client: jest.fn(() => ({
      where: mockWhere,
      first: mockFirst,
      select: mockSelect,
      update: mockUpdate,
      insert: mockInsert,
      del: mockDel,
    })),
  },
}));

// --- Mock hash utils ---
jest.mock('../../../server/utils/hashPassword.js', () => ({
  generateHash: jest.fn((password) => `hashed-${password}`),
  verifyPassword: jest.fn((password, hash) => hash === `hashed-${password}`),
}));

// --- Mock session module ---
jest.mock('../../../server/database/queries/session.js', () => ({
  createUserSession: jest.fn(() => 'session-id'),
}));

import { AuthorizationError, ConflictError } from '../../../server/utils/errors.js';

// --- Import user queries AFTER mocks ---
import * as userQueries from '../../../server/database/queries/user.js';

describe('User Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signInUser throws if user does not exist', async () => {
    mockWhere.mockReturnValueOnce({ first: jest.fn().mockResolvedValue(null) });

    await expect(userQueries.signInUser('test@example.com', 'password'))
      .rejects.toThrow(AuthorizationError);
  });

  it('signInUser throws if password does not match', async () => {
    mockWhere.mockReturnValueOnce({
      first: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'hashed-123', sso: false }),
    });

    const hashModule = require('../../../server/utils/hashPassword.js');
    jest.spyOn(hashModule, 'verifyPassword').mockReturnValue(false);

    await expect(userQueries.signInUser('test@example.com', '123'))
      .rejects.toThrow(AuthorizationError);
  });

  it('signInUser returns user on correct password', async () => {
    mockWhere.mockReturnValueOnce({
      first: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'hashed-123', sso: false }),
    });

    const hashModule = require('../../../server/utils/hashPassword.js');
    jest.spyOn(hashModule, 'verifyPassword').mockReturnValue(true);

    const user = await userQueries.signInUser('test@example.com', '123');
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  it('registerUser hashes password and inserts', async () => {
    mockWhere.mockReturnValueOnce({ first: jest.fn().mockResolvedValue(null) });

    const data = { email: 'new@example.com', password: '123' };
    const result = await userQueries.registerUser(data);

    expect(result.password).toBe('hashed-123');
    expect(mockInsert).toHaveBeenCalled();
  });

  it('registerUser throws ConflictError if email exists', async () => {
    mockWhere.mockReturnValueOnce({ first: jest.fn().mockResolvedValue({ email: 'existing@example.com' }) });

    await expect(userQueries.registerUser({ email: 'existing@example.com', password: '123' }))
      .rejects.toThrow(ConflictError);
  });

  it('getUserByEmail calls select and first', async () => {
    const firstMock = jest.fn().mockResolvedValue({ email: 'test@example.com' });
    mockWhere.mockReturnValueOnce({ select: jest.fn(() => ({ first: firstMock })) });

    const user = await userQueries.getUserByEmail('test@example.com');
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  it('updateUserDisplayname calls update', async () => {
    mockWhere.mockReturnValueOnce({ update: mockUpdate });

    await userQueries.updateUserDisplayname('test@example.com', 'New Name');
    expect(mockUpdate).toHaveBeenCalledWith({ displayName: 'New Name' });
  });

  it('resetDemoUser updates if demo exists', async () => {
    mockWhere.mockReturnValueOnce({ first: jest.fn().mockResolvedValue({ email: 'demo' }), update: mockUpdate });

    await userQueries.resetDemoUser();
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('getDemoUser creates session if demo exists', async () => {
    mockWhere.mockReturnValueOnce({ first: jest.fn().mockResolvedValue({ email: 'demo' }) });

    const session = await userQueries.getDemoUser();
    expect(session).toBe('session-id');
  });
});
