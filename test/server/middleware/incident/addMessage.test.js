/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Validators
jest.mock('../../../../shared/validators/incident.js', () => ({
  incidentMessageValidator: jest.fn(),
}));

// Mock Database Queries (Prevents ESM/nanoid crashes)
jest.mock('../../../../server/database/queries/incident.js', () => ({
  __esModule: true,
  fetchIncident: jest.fn(),
  updateIncident: jest.fn(),
}));

// Mock Status Cache
jest.mock('../../../../server/cache/status.js', () => ({
  __esModule: true,
  default: {
    addIncident: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import createIncidentMessageMiddleware from '../../../../server/middleware/incident/addMessage.js';
import {
  fetchIncident,
  updateIncident,
} from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';
import { incidentMessageValidator } from '../../../../shared/validators/incident.js';

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

    await createIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident id is required',
    });
  });

  it('should return 400 if message is invalid', async () => {
    fakeRequest.body.incidentId = 'id';
    
    // Validator returns an error string
    incidentMessageValidator.mockReturnValue('invalid');

    await createIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should return 404 if incident not found', async () => {
    // Validator returns false (valid)
    incidentMessageValidator.mockReturnValue(false);
    
    // DB returns null
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