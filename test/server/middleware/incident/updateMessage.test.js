/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Validator
jest.mock('../../../../shared/validators/incident.js', () => ({
  incidentMessageValidator: jest.fn(),
}));

// Mock Database (Prevents potential ESM/nanoid crashes)
jest.mock('../../../../server/database/queries/incident.js', () => ({
  fetchIncident: jest.fn(),
  updateIncident: jest.fn(),
}));

// Mock Cache
jest.mock('../../../../server/cache/status.js', () => ({
  __esModule: true,
  default: {
    addIncident: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import updateIncidentMessageMiddleware from '../../../../server/middleware/incident/updateMessage.js';
import {
  fetchIncident,
  updateIncident,
} from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';
import { incidentMessageValidator } from '../../../../shared/validators/incident.js';

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

    // Setup spies
    fakeResponse.json = jest.fn();
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.locals = { user: { email: 'e' } };

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    
    // Validator returns error string
    incidentMessageValidator.mockReturnValue('invalid');

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should return 404 if incident not found', async () => {
    // Validator valid
    incidentMessageValidator.mockReturnValue(false);
    
    // DB returns null
    fetchIncident.mockResolvedValue(null);

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Incident not found',
    });
  });

  it('should return 404 if message not found at position', async () => {
    incidentMessageValidator.mockReturnValue(false);
    
    // DB returns incident with empty messages array
    fetchIncident.mockResolvedValue({ messages: [] });

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Message not found',
    });
  });

  it('should update message and return data if valid', async () => {
    incidentMessageValidator.mockReturnValue(false);

    // Mock existing incident with a message at index 0
    fetchIncident.mockResolvedValue({
      messages: [
        { message: 'old', status: 'old', email: 'old', monitorIds: ['m'] },
      ],
      status: 'old',
      monitorIds: ['m'],
      incidentId: 'id',
    });

    updateIncident.mockResolvedValue({ updated: true });

    // Ensure response object has spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.json = jest.fn();
    fakeResponse.locals = { user: { email: 'e' } };

    await updateIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(updateIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({ updated: true });
  });
});