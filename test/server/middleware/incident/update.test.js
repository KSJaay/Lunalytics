import { createRequest, createResponse } from 'node-mocks-http';
import statusCache from '../../../../server/cache/status.js';
import IncidentValidator from '../../../../shared/validators/incident.js';
import { updateIncident } from '../../../../server/database/queries/incident.js';
import updateIncidentMiddleware from '../../../../server/middleware/incident/update.js';

vi.mock('../../../../shared/validators/incident.js');
vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/cache/status.js');

describe('updateIncidentMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { incident: { messages: [{}, {}], incidentId: 'id' } };
    fakeResponse.json = vi.fn();
    fakeResponse.status = vi.fn().mockReturnThis();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if incident is invalid', async () => {
    IncidentValidator.mockReturnValue('invalid');
    await updateIncidentMiddleware(fakeRequest, fakeResponse);
    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should update incident and return data if valid', async () => {
    IncidentValidator.mockReturnValue(false);
    updateIncident.mockResolvedValue({ updated: true });

    await updateIncidentMiddleware(fakeRequest, fakeResponse);

    expect(updateIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({ updated: true });
  });
});
