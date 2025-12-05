import SQLite from '../../../server/database/sqlite/setup.js';
import * as inviteQueries from '../../../server/database/queries/invite.js';
import { customAlphabet } from 'nanoid';
import { timeToMs } from '../../../shared/utils/ms.js';

jest.mock('nanoid', () => ({
  customAlphabet: jest.fn(() => jest.fn().mockReturnValue('uniquetok')),
}));

jest.mock('../../../shared/utils/ms.js');

describe('Invite Queries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetchInviteUsingId returns invite', async () => {
    const firstMock = jest.fn().mockResolvedValue({ email: 'test@example.com' });
    const whereMock = jest.fn(() => ({ first: firstMock }));

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await inviteQueries.fetchInviteUsingId('uniquetok');

    expect(SQLite.client).toHaveBeenCalledWith('invite');
    expect(whereMock).toHaveBeenCalledWith({ token: 'uniquetok' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ email: 'test@example.com' });
  });

  it('fetchAllInvites returns all invites', async () => {
    const selectMock = jest.fn().mockResolvedValue([{ email: 'a@b.com' }]);
    SQLite.client = jest.fn(() => ({ select: selectMock }));

    const result = await inviteQueries.fetchAllInvites();

    expect(SQLite.client).toHaveBeenCalledWith('invite');
    expect(selectMock).toHaveBeenCalled();
    expect(result).toEqual([{ email: 'a@b.com' }]);
  });

  it('createInvite inserts new invite', async () => {
    const insertMock = jest.fn().mockResolvedValue([1]);
    const whereMock = jest.fn(() => ({ first: jest.fn().mockResolvedValue(null) }));
    SQLite.client = jest.fn(() => ({ insert: insertMock, where: whereMock }));

    timeToMs.mockReturnValue(3600000); // 1 hour in ms

    const result = await inviteQueries.createInvite('test@example.com', '1 hour', 5, 'admin');

    expect(SQLite.client).toHaveBeenCalledWith('invite');
    expect(insertMock).toHaveBeenCalled();
    expect(result.email).toBe('test@example.com');
    expect(result.token).toBe('uniquetok');
    expect(result.limit).toBe(5);
    expect(result.permission).toBe('admin');
    expect(result.paused).toBe(false);
  });

  it('pauseInvite updates paused field', async () => {
    const updateMock = jest.fn();
    const whereMock = jest.fn(() => ({ update: updateMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await inviteQueries.pauseInvite('uniquetok', true);

    expect(whereMock).toHaveBeenCalledWith({ token: 'uniquetok' });
    expect(updateMock).toHaveBeenCalledWith({ paused: true });
    expect(result).toBe(true);
  });

  it('deleteInvite calls del', async () => {
    const delMock = jest.fn();
    const whereMock = jest.fn(() => ({ del: delMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    await inviteQueries.deleteInvite('uniquetok');

    expect(whereMock).toHaveBeenCalledWith({ token: 'uniquetok' });
    expect(delMock).toHaveBeenCalled();
  });

    it('increaseInviteUses increments uses and deletes invite if limit reached', async () => {
    // Case: uses < limit
    const updateMock = jest.fn();
    const firstMock = jest.fn().mockResolvedValue({ token: 'uniquetok', uses: 1, limit: 3 });
    const whereMock = jest.fn()
        .mockReturnValueOnce({ first: firstMock })  // fetch invite
        .mockReturnValueOnce({ update: updateMock }); // update uses

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    let result = await inviteQueries.increaseInviteUses('uniquetok');

    expect(updateMock).toHaveBeenCalledWith({ uses: 2 });
    expect(result).toBe(false);

    // Case: uses >= limit
    const delMock = jest.fn().mockResolvedValue(true);
    const firstMock2 = jest.fn().mockResolvedValue({ token: 'uniquetok', uses: 5, limit: 5 });

    const whereMock2 = jest.fn()
        .mockReturnValueOnce({ first: firstMock2 })  // fetch invite
        .mockReturnValueOnce({ del: delMock });      // delete invite

    SQLite.client = jest.fn(() => ({ where: whereMock2 }));

    result = await inviteQueries.increaseInviteUses('uniquetok');
    expect(delMock).toHaveBeenCalled();
    expect(result).toBe(true);
    });

});
