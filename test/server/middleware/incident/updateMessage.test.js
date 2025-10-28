import { createRequest, createResponse } from 'node-mocks-http';
import {
  fetchIncident,
  updateIncident,
} from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';
import { incidentMessageValidator } from '../../../../shared/validators/incident.js';
import updateIncidentMessageMiddleware from '../../../../server/middleware/incident/updateMessage.js';

vi.mock('../../../../shared/validators/incident.js');
vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/cache/status.js');

describe('updateIncidentMessageMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = {
      message: 'msg',
      status: 'ok',
      monitorIds: ['m'],
      incidentId: 'id',
      position: 0,
    };
    fakeRequest.locals = { user: { email: 'e' } };

    fakeResponse.json = vi.fn();
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.locals = { user: { email: 'e' } };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if incidentId or position is missing', async () => {
    fakeRequest.body.incidentId = undefined;

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident id is required',
    });
  });

  it('should return 400 if message is invalid', async () => {
    fakeRequest.body.incidentId = 'id';
    fakeRequest.body.position = 0;
    incidentMessageValidator.mockReturnValue('invalid');

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should return 404 if incident not found', async () => {
    incidentMessageValidator.mockReturnValue(false);
    fetchIncident.mockResolvedValue(null);

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident not found',
    });
  });

  it('should return 404 if message not found at position', async () => {
    incidentMessageValidator.mockReturnValue(false);
    fetchIncident.mockResolvedValue({ messages: [] });

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Message not found',
    });
  });

  it('should update message and return data if valid', async () => {
    incidentMessageValidator.mockReturnValue(false);

    fetchIncident.mockResolvedValue({
      messages: [
        { message: 'old', status: 'old', email: 'old', monitorIds: ['m'] },
      ],
      status: 'old',
      monitorIds: ['m'],
      incidentId: 'id',
    });

    updateIncident.mockResolvedValue({ updated: true });

    fakeResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      locals: { user: { email: 'e' } },
    };

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(updateIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({ updated: true });
  });
});
