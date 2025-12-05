import SQLite from '../../../server/database/sqlite/setup.js';
import * as status from '../../../server/database/queries/status.js';
import { cleanIncident } from '../../../server/class/incident.js';
import { ConflictError } from '../../../shared/utils/errors.js';

jest.mock('../../../server/database/sqlite/setup.js', () => ({
  client: jest.fn(),
}));

jest.mock('../../../server/class/incident.js', () => ({
  cleanIncident: jest.fn((incident) => incident), // return incident as-is
}));

describe('Status Page Queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchAllStatusPages returns cleaned status pages', async () => {
    const mockStatusPages = [{ statusId: '1' }, { statusId: '2' }];
    const selectMock = jest.fn().mockResolvedValue(mockStatusPages);
    SQLite.client.mockReturnValue({ select: selectMock });

    const result = await status.fetchAllStatusPages();
    expect(SQLite.client).toHaveBeenCalledWith('status_page');
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('statusId');
  });

  it('fetchStatusPageUsingId calls where().first()', async () => {
    const firstMock = jest.fn().mockResolvedValue({ statusId: '1' });
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client.mockReturnValue({ where: whereMock });

    const result = await status.fetchStatusPageUsingId('1');
    expect(SQLite.client).toHaveBeenCalledWith('status_page');
    expect(whereMock).toHaveBeenCalledWith({ statusId: '1' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ statusId: '1' });
  });

  it('fetchStatusPageUsingUrl calls where().first()', async () => {
    const firstMock = jest.fn().mockResolvedValue({ statusUrl: 'url' });
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client.mockReturnValue({ where: whereMock });

    const result = await status.fetchStatusPageUsingUrl('url');
    expect(SQLite.client).toHaveBeenCalledWith('status_page');
    expect(whereMock).toHaveBeenCalledWith({ statusUrl: 'url' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ statusUrl: 'url' });
  });

  it('createStatusPage inserts and returns the status page', async () => {
    const insertMock = jest.fn().mockResolvedValue([1]);
    const firstMock = jest.fn().mockResolvedValue({ statusId: 'unique-id' });
    const whereMock = jest.fn(() => ({ first: firstMock }));

    SQLite.client
      .mockReturnValueOnce({ where: jest.fn(() => ({ first: jest.fn().mockResolvedValue(null) })) }) // fetchStatusPageUsingUrl
      .mockReturnValueOnce({ insert: insertMock }) // insert
      .mockReturnValueOnce({ where: whereMock }); // return inserted page

    const settings = { url: 'url' };
    const layout = [];
    const user = { email: 'test@example.com' };

    const result = await status.createStatusPage(settings, layout, user);

    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      statusId: expect.any(String),
      statusUrl: 'url',
      email: 'test@example.com',
      settings: JSON.stringify(settings),
      layout: JSON.stringify([]),
      createdAt: expect.any(String),
    }));

    expect(result).toEqual({ statusId: 'unique-id' });
  });

  it('createStatusPage throws ConflictError if URL exists', async () => {
    SQLite.client.mockReturnValue({ where: jest.fn(() => ({ first: jest.fn().mockResolvedValue({ statusId: 'exists' }) })) });

    await expect(
      status.createStatusPage({ url: 'url' }, [], { email: 'test' })
    ).rejects.toThrow(ConflictError);
  });

  it('updateStatusPage updates and returns status page', async () => {
    const firstMock = jest.fn().mockResolvedValue({ statusId: 'unique-id' });
    const updateMock = jest.fn().mockResolvedValue(1);
    const whereUpdateMock = jest.fn(() => ({ update: updateMock }));
    const whereFirstMock = jest.fn(() => ({ first: firstMock }));

    SQLite.client
      .mockReturnValueOnce({ where: whereFirstMock }) // fetchStatusPageUsingId
      .mockReturnValueOnce({ where: whereUpdateMock }) // update
      .mockReturnValueOnce({ where: whereFirstMock }); // return updated

    const settings = { url: 'url' };
    const layout = [];
    const user = { email: 'test@example.com' };

    const result = await status.updateStatusPage('unique-id', settings, layout, user);

    expect(result).toEqual({ statusId: 'unique-id' });
  });

  it('updateStatusPage throws ConflictError if status does not exist', async () => {
    SQLite.client.mockReturnValue({ where: jest.fn(() => ({ first: jest.fn().mockResolvedValue(null) })) });

    await expect(status.updateStatusPage('nonexistent', {}, [], { email: 'test' }))
      .rejects
      .toThrow(ConflictError);
  });

  it('deleteStatusPage calls where().delete()', async () => {
    const deleteMock = jest.fn();
    const whereMock = jest.fn(() => ({ delete: deleteMock }));
    const firstMock = jest.fn().mockResolvedValue({ statusId: 'unique-id' });

    SQLite.client.mockReturnValueOnce({ where: jest.fn(() => ({ first: firstMock })) }) // fetchStatusPageUsingId
                  .mockReturnValueOnce({ where: whereMock }); // delete

    await status.deleteStatusPage('unique-id');

    expect(whereMock).toHaveBeenCalledWith({ statusId: 'unique-id' });
    expect(deleteMock).toHaveBeenCalled();
  });

  it('fetchMonitorsUsingIdArray calls whereIn().select()', async () => {
    const selectMock = jest.fn();
    const whereInMock = jest.fn(() => ({ select: selectMock }));
    SQLite.client.mockReturnValue({ whereIn: whereInMock });

    await status.fetchMonitorsUsingIdArray([1, 2]);

    expect(whereInMock).toHaveBeenCalledWith('monitorId', [1, 2]);
    expect(selectMock).toHaveBeenCalled();
  });

  it('fetchIncidentsUsingIdArray calls whereRaw, andWhere, select', async () => {
    const selectMock = jest.fn().mockResolvedValue([{ incidentId: 1 }]);
    const andWhereMock = jest.fn(() => ({ select: selectMock }));
    const whereRawMock = jest.fn(() => ({ andWhere: andWhereMock }));
    SQLite.client.mockReturnValue({ whereRaw: whereRawMock });

    const result = await status.fetchIncidentsUsingIdArray([1, 2], 90);

    expect(whereRawMock).toHaveBeenCalled();
    expect(andWhereMock).toHaveBeenCalled();
    expect(selectMock).toHaveBeenCalled();
    expect(result).toEqual([{ incidentId: 1 }]); // cleanIncident mocked
  });
});
