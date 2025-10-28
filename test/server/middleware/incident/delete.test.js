import { afterEach } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import statusCache from '../../../../server/cache/status.js';
import { deleteIncident } from '../../../../server/database/queries/incident.js';
import deleteIncidentMiddleware from '../../../../server/middleware/incident/delete.js';

vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/cache/status.js');

describe('deleteIncidentMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { incidentId: 'id' };
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.json = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if incidentId is missing', async () => {
    fakeRequest.body.incidentId = undefined;

    await deleteIncidentMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident id is required',
    });
  });

  it('should delete incident and return success', async () => {
    await deleteIncidentMiddleware(fakeRequest, fakeResponse);

    expect(deleteIncident).toHaveBeenCalledWith('id');
    expect(statusCache.deleteIncident).toHaveBeenCalledWith('id');
    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident deleted successfully',
    });
  });

  it('should handle errors and return 400', async () => {
    deleteIncident.mockImplementation(() => {
      throw new Error('fail');
    });

    await deleteIncidentMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'fail' });
  });
});
