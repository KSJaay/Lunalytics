import SQLite from '../../../server/database/sqlite/setup.js';
import * as connection from '../../../server/database/queries/connection.js';

describe('Connection Queries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('createConnection calls insert with correct data', async () => {
    const insertMock = jest.fn().mockResolvedValue(1);

    SQLite.client = jest.fn(() => ({ insert: insertMock }));

    const email = 'test@example.com';
    const data = { provider: 'google', accountId: '123' };

    await connection.createConnection(email, data);

    expect(SQLite.client).toHaveBeenCalledWith('connections');
    expect(insertMock).toHaveBeenCalledWith({ email, ...data });
  });

  it('deleteConnection calls where and delete with correct parameters', async () => {
    const deleteMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ delete: deleteMock }));

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    await connection.deleteConnection('test@example.com', 'google');

    expect(SQLite.client).toHaveBeenCalledWith('connections');
    expect(whereMock).toHaveBeenCalledWith({ email: 'test@example.com', provider: 'google' });
    expect(deleteMock).toHaveBeenCalled();
  });

  it('fetchConnections calls where and select and returns connections', async () => {
    const selectMock = jest.fn().mockResolvedValue([{ email: 'test@example.com' }]);
    const whereMock = jest.fn(() => ({ select: selectMock }));

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await connection.fetchConnections('test@example.com');

    expect(SQLite.client).toHaveBeenCalledWith('connections');
    expect(whereMock).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(result).toEqual([{ email: 'test@example.com' }]);
  });

  it('fetchConnectionByEmail calls where, select, first and returns single connection', async () => {
    const firstMock = jest.fn().mockResolvedValue({ email: 'test@example.com', provider: 'google' });
    const selectMock = jest.fn(() => ({ first: firstMock }));
    const whereMock = jest.fn(() => ({ select: selectMock }));

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await connection.fetchConnectionByEmail('google', '123');

    expect(SQLite.client).toHaveBeenCalledWith('connections');
    expect(whereMock).toHaveBeenCalledWith({ provider: 'google', accountId: '123' });
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ email: 'test@example.com', provider: 'google' });
  });
});
