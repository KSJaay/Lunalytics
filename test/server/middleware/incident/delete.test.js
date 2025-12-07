/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database (Prevents potential ESM/nanoid crashes)
jest.mock('../../../../server/database/queries/incident.js', () => ({
  deleteIncident: jest.fn(),
}));

// Mock Cache
jest.mock('../../../../server/cache/status.js', () => ({
  __esModule: true,
  default: {
    deleteIncident: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import deleteIncidentMiddleware from '../../../../server/middleware/incident/delete.js';
import { deleteIncident } from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';

describe('deleteIncidentMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { incidentId: 'id' };
    
    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.json = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    // Force DB error
    deleteIncident.mockImplementation(() => {
      throw new Error('fail');
    });

    await deleteIncidentMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'fail' });
  });
});