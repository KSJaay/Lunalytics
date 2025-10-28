import { createRequest, createResponse } from 'node-mocks-http';
import {
  fetchIncident,
  updateIncident,
} from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';
import { incidentMessageValidator } from '../../../../shared/validators/incident.js';
import createIncidentMessageMiddleware from '../../../../server/middleware/incident/addMessage.js';

vi.mock('../../../../shared/validators/incident.js');
vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/cache/status.js');

describe('createIncidentMessageMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = {
      message: 'msg',
      status: 'ok',
      monitorIds: ['m'],
      incidentId: 'id',
    };

    fakeRequest.locals = { user: { email: 'e' } };
    fakeResponse.locals = { user: { email: 'e' } };

    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.json = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if incidentId is missing', async () => {
    fakeRequest.body.incidentId = undefined;

    await createIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident id is required',
    });
  });

  it('should return 400 if message is invalid', async () => {
    fakeRequest.body.incidentId = 'id';
    incidentMessageValidator.mockReturnValue('invalid');

    await createIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should return 404 if incident not found', async () => {
    incidentMessageValidator.mockReturnValue(false);
    fetchIncident.mockResolvedValue(null);

    await createIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident not found',
    });
  });

  it('should update incident and return data if valid', async () => {
    incidentMessageValidator.mockReturnValue(false);
    fetchIncident.mockResolvedValue({
      messages: [],
      status: 'old',
      monitorIds: ['m'],
      incidentId: 'id',
    });
    updateIncident.mockResolvedValue({ updated: true });

    await createIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(updateIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({ updated: true });
  });
});
