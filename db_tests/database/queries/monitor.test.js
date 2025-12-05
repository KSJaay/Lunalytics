import SQLite from '../../../server/database/sqlite/setup.js';
import * as monitorQueries from '../../../server/database/queries/monitor.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';

describe('Monitor Queries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('monitorExists returns monitor if exists', async () => {
    const firstMock = jest.fn().mockResolvedValue({ monitorId: 'mon123' });
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await monitorQueries.monitorExists('mon123');

    expect(SQLite.client).toHaveBeenCalledWith('monitor');
    expect(whereMock).toHaveBeenCalledWith({ monitorId: 'mon123' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ monitorId: 'mon123' });
  });

  it('createMonitor inserts a new monitor and returns it', async () => {
    const returningMock = jest.fn().mockResolvedValue([{ monitorId: 'mon123', name: 'Test' }]);
    const insertMock = jest.fn(() => ({ returning: returningMock }));
    SQLite.client = jest.fn(() => ({ insert: insertMock }));

    const monitorData = { name: 'Test' };
    const result = await monitorQueries.createMonitor(monitorData);

    expect(SQLite.client).toHaveBeenCalledWith('monitor');
    expect(insertMock).toHaveBeenCalled();
    expect(returningMock).toHaveBeenCalled();
    expect(result).toEqual({ monitorId: 'mon123', name: 'Test' });
  });

  it('updateMonitor updates monitor data', async () => {
    const updateMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ update: updateMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const monitor = { monitorId: 'mon123', name: 'Updated' };
    const result = await monitorQueries.updateMonitor(monitor);

    expect(SQLite.client).toHaveBeenCalledWith('monitor');
    expect(whereMock).toHaveBeenCalledWith({ monitorId: 'mon123' });
    expect(updateMock).toHaveBeenCalledWith(monitor);
    expect(result).toEqual(monitor);
  });

  it('fetchMonitor throws error if monitor does not exist', async () => {
    const firstMock = jest.fn().mockResolvedValue(null);
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    await expect(monitorQueries.fetchMonitor('mon123')).rejects.toThrow(UnprocessableError);
  });

  it('deleteMonitor calls del and returns true', async () => {
    const delMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ del: delMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await monitorQueries.deleteMonitor('mon123');

    expect(SQLite.client).toHaveBeenCalledWith('monitor');
    expect(whereMock).toHaveBeenCalledWith({ monitorId: 'mon123' });
    expect(delMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('pauseMonitor updates paused field if monitor exists', async () => {
    const updateMock = jest.fn().mockResolvedValue(1);
    const firstMock = jest.fn().mockResolvedValue({ monitorId: 'mon123' });
    const whereMock = jest.fn()
      .mockReturnValueOnce({ first: firstMock }) // check existence
      .mockReturnValueOnce({ update: updateMock }); // update paused

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    await monitorQueries.pauseMonitor('mon123', true);

    expect(SQLite.client).toHaveBeenCalledWith('monitor');
    expect(whereMock).toHaveBeenCalledTimes(2);
    expect(updateMock).toHaveBeenCalledWith({ paused: true });
  });

  it('fetchUsingUrl returns monitor if exists', async () => {
    const firstMock = jest.fn().mockResolvedValue({ monitorId: 'mon123', url: 'test.com' });
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await monitorQueries.fetchUsingUrl('test.com');

    expect(SQLite.client).toHaveBeenCalledWith('monitor');
    expect(whereMock).toHaveBeenCalledWith({ url: 'test.com' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ monitorId: 'mon123', url: 'test.com' });
  });

  it('fetchUsingUrl throws error if monitor does not exist', async () => {
    const firstMock = jest.fn().mockResolvedValue(null);
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    await expect(monitorQueries.fetchUsingUrl('missing.com')).rejects.toThrow(UnprocessableError);
  });
});
