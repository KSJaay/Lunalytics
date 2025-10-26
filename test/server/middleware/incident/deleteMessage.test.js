import {
  fetchIncident,
  updateIncident,
} from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';
import deleteIncidentMessageMiddleware from '../../../../server/middleware/incident/deleteMessage.js';
import { createRequest, createResponse } from 'node-mocks-http';

vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/cache/status.js');
vi.mock('../../../../server/utils/errors.js');

describe('deleteIncidentMessageMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { incidentId: 'id', position: 0 };
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.json = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if incidentId is missing', async () => {
    fakeRequest.body.incidentId = undefined;

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident id is required',
    });
  });

  it('should return 404 if incident not found', async () => {
    fetchIncident.mockResolvedValue(null);

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident not found',
    });
  });

  it('should return 404 if position is invalid', async () => {
    fetchIncident.mockResolvedValue({ messages: [] });

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Message not found',
    });
  });

  it('should return 404 if only one message', async () => {
    fetchIncident.mockResolvedValue({ messages: [{}, {}] });

    fakeRequest.body.position = 0;
    fetchIncident.mockResolvedValue({ messages: [{}] });

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Need to have at least one message',
    });
  });

  it('should update incident and return data if valid', async () => {
    const responseQuery = {
      messages: [{ status: 'old' }, { status: 'new' }],
      status: 'unknown',
      incidentId: 'id',
    };

    fetchIncident.mockResolvedValue(responseQuery);

    updateIncident.mockResolvedValue({ updated: true });

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(updateIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({
      ...responseQuery,
      status: 'new',
    });
  });

  it('should handle errors gracefully', async () => {
    fetchIncident.mockImplementation(() => {
      throw new Error('fail');
    });

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
