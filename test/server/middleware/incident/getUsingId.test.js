/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database (Prevents potential ESM/nanoid crashes)
jest.mock('../../../../server/database/queries/incident.js', () => ({
  fetchIncident: jest.fn(),
}));

// Mock Error Handler
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import fetchIncidentUsingId from '../../../../server/middleware/incident/getUsingId.js';
import { fetchIncident } from '../../../../server/database/queries/incident.js';
import { handleError } from '../../../../server/utils/errors.js';

describe('fetchIncidentUsingId', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = { incidentId: 'id' };
    
    // Setup spies
    fakeResponse.json = jest.fn();
    fakeResponse.status = jest.fn().mockReturnThis();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UnprocessableError (call handleError) if incidentId is missing', async () => {
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