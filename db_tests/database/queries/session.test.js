import SQLite from '../../../server/database/sqlite/setup.js';
import * as session from '../../../server/database/queries/session.js';

// Mock SQLite client for all tests
jest.mock('../../../server/database/sqlite/setup.js', () => ({
  client: jest.fn(),
}));

// Mock nanoid to avoid ESM import issue
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'fake-session-id'),
}));

describe('User Session Queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createUserSession inserts a new session and returns sessionId', async () => {
    // Mock for userSessionExists
    const firstMock = jest.fn().mockResolvedValue(null); // no existing session
    const whereMock = jest.fn(() => ({ first: firstMock }));
    
    // Mock for insert
    const insertMock = jest.fn().mockResolvedValue([1]);

    // SQLite.client should return either insert OR where depending on call
    SQLite.client.mockImplementation((table) => {
      if (table === 'user_session') {
        return {
          insert: insertMock,
          where: whereMock,
        };
      }
      return {};
    });

    const sessionId = await session.createUserSession('test@example.com', 'desktop', { foo: 'bar' });

    expect(SQLite.client).toHaveBeenCalledWith('user_session');
    expect(whereMock).toHaveBeenCalledWith({ sessionId: 'fake-session-id' });
    expect(firstMock).toHaveBeenCalled();
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
      sessionId: 'fake-session-id',
      device: 'desktop',
      data: { foo: 'bar' },
      createdAt: expect.any(String),
    }));
    expect(sessionId).toBe('fake-session-id');
  });

  it('userSessionExists calls where and returns session', async () => {
    const firstMock = jest.fn().mockResolvedValue({ sessionId: 'fake-session-id' });
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client.mockReturnValue({ where: whereMock });

    const result = await session.userSessionExists('fake-session-id');

    expect(SQLite.client).toHaveBeenCalledWith('user_session');
    expect(whereMock).toHaveBeenCalledWith({ sessionId: 'fake-session-id' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ sessionId: 'fake-session-id' });
  });

  it('deleteUserSession calls where and del', async () => {
    const delMock = jest.fn();
    const whereMock = jest.fn(() => ({ del: delMock }));
    SQLite.client.mockReturnValue({ where: whereMock });

    await session.deleteUserSession('fake-session-id');

    expect(SQLite.client).toHaveBeenCalledWith('user_session');
    expect(whereMock).toHaveBeenCalledWith({ sessionId: 'fake-session-id' });
    expect(delMock).toHaveBeenCalled();
  });
});
