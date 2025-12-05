import SQLite from '../../../server/database/sqlite/setup.js';
import * as incidentQueries from '../../../server/database/queries/incident.js';
import randomId from '../../../server/utils/randomId.js';
import { cleanIncident } from '../../../server/class/incident.js';

jest.mock('../../../server/utils/randomId.js');
jest.mock('../../../server/class/incident.js');

describe('Incident Queries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getUniqueId generates a new unique id', async () => {
    const firstId = 'abc123';
    const secondId = 'def456';
    randomId
      .mockReturnValueOnce(firstId)
      .mockReturnValueOnce(secondId);

    const firstCheck = jest.fn().mockResolvedValue(true);
    const secondCheck = jest.fn().mockResolvedValue(false);

    // Properly mock the chain: where().first()
    const whereMock = jest.fn()
      .mockReturnValueOnce({ first: firstCheck })
      .mockReturnValueOnce({ first: secondCheck });

    SQLite.client = jest.fn(() => ({ where: whereMock, insert: jest.fn() }));

    cleanIncident.mockImplementation(x => x);

    const data = { messages: [], monitorIds: [] };
    await incidentQueries.createIncident(data);

    expect(randomId).toHaveBeenCalledTimes(2);
  });

  it('createIncident inserts data with unique id', async () => {
    const id = 'xyz789';
    randomId.mockReturnValue(id);

    const insertMock = jest.fn().mockResolvedValue([1]);
    const whereMock = jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue(false) });

    SQLite.client = jest.fn(() => ({ where: whereMock, insert: insertMock }));

    cleanIncident.mockImplementation(x => x);

    const data = { messages: ['msg'], monitorIds: [1] };
    const result = await incidentQueries.createIncident(data);

    expect(insertMock).toHaveBeenCalledWith({
      ...data,
      incidentId: id,
      messages: JSON.stringify(data.messages),
      monitorIds: JSON.stringify(data.monitorIds),
    });
    expect(result.incidentId).toBe(id);
  });

  it('updateIncident updates data and returns cleaned incident', async () => {
    const returningMock = jest.fn().mockResolvedValue([{ incidentId: '123', title: 'Updated' }]);
    const updateMock = jest.fn(() => ({ returning: returningMock }));
    const whereMock = jest.fn(() => ({ update: updateMock }));

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    cleanIncident.mockImplementation(x => x);

    const data = { messages: ['msg'], monitorIds: [1] };
    const result = await incidentQueries.updateIncident('123', data);

    expect(updateMock).toHaveBeenCalledWith({
      ...data,
      messages: JSON.stringify(data.messages),
      monitorIds: JSON.stringify(data.monitorIds),
    });
    expect(result).toEqual({ incidentId: '123', title: 'Updated' });
  });

  it('deleteIncident calls del and returns true', async () => {
    const delMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ del: delMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await incidentQueries.deleteIncident('123');

    expect(whereMock).toHaveBeenCalledWith({ incidentId: '123' });
    expect(delMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
