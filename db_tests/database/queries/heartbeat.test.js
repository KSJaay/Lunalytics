import SQLite from '../../../server/database/sqlite/setup.js';
import * as heartbeat from '../../../server/database/queries/heartbeat.js';

describe('Heartbeat Queries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetchDailyHeartbeats groups heartbeats', async () => {
    const fixedTime = new Date('2025-12-04T18:28:17.167Z').getTime();

    // Mock Date.now()
    jest.spyOn(global.Date, 'now').mockImplementation(() => fixedTime);

    const rows = [
      { id: 1, monitorId: 10, isDown: 0, date: '2025-12-04T05:30:00Z', status: 'up', latency: 100 },
      { id: 2, monitorId: 10, isDown: 0, date: '2025-12-04T07:30:00Z', status: 'up', latency: 200 }
    ];

    const mockedOrderBy = jest.fn().mockResolvedValue(rows);
    const mockedWhere2  = jest.fn(() => ({ orderBy: mockedOrderBy }));
    const mockedWhere1  = jest.fn(() => ({ andWhere: mockedWhere2 }));

    SQLite.client = jest.fn(() => ({ where: mockedWhere1 }));

    const result = await heartbeat.fetchDailyHeartbeats(10);

    expect(SQLite.client).toHaveBeenCalledWith('heartbeat');
    expect(mockedWhere1).toHaveBeenCalledWith({ monitorId: 10, isDown: false });

    // Calculate expected "date > yesterday"
    const expectedDate = new Date(fixedTime - 86400000).toISOString();
    expect(mockedWhere2).toHaveBeenCalledWith('date', '>', expectedDate);
    expect(mockedOrderBy).toHaveBeenCalledWith('date', 'desc');

    // Check grouping output is array (exact values depend on your grouping logic)
    expect(Array.isArray(result)).toBe(true);
  });
});