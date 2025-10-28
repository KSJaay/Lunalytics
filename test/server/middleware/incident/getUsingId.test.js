import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchIncident } from '../../../../server/database/queries/incident.js';
import fetchIncidentUsingId from '../../../../server/middleware/incident/getUsingId.js';

vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/utils/errors.js');

describe('fetchIncidentUsingId', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { incidentId: 'id' };
    fakeResponse.json = vi.fn();
    fakeResponse.status = vi.fn().mockReturnThis();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw UnprocessableError if incidentId is missing', async () => {
    fakeRequest.query.incidentId = undefined;

    await fetchIncidentUsingId(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });

  it('should return 404 if incident not found', async () => {
    fetchIncident.mockResolvedValue(null);

    await fetchIncidentUsingId(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error: 'Incident not found',
    });
  });

  it('should return data if found', async () => {
    fetchIncident.mockResolvedValue({ id: 1 });

    await fetchIncidentUsingId(fakeRequest, fakeResponse);

    expect(fakeResponse.json).toHaveBeenCalledWith({ id: 1 });
  });
});
