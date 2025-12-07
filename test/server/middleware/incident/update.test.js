/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Validator (Default Export)
jest.mock('../../../../shared/validators/incident.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Database (Prevents potential ESM/nanoid crashes)
jest.mock('../../../../server/database/queries/incident.js', () => ({
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
import updateIncidentMiddleware from '../../../../server/middleware/incident/update.js';
import IncidentValidator from '../../../../shared/validators/incident.js';
import { updateIncident } from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';

describe('updateIncidentMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { incident: { messages: [{}, {}], incidentId: 'id' } };
    
    // Setup spies
    fakeResponse.json = jest.fn();
    fakeResponse.status = jest.fn().mockReturnThis();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if incident is invalid', async () => {
    // Validator returns error string
    IncidentValidator.mockReturnValue('invalid');

    await updateIncidentMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should update incident and return data if valid', async () => {
    // Validator returns false (valid)
    IncidentValidator.mockReturnValue(false);
    
    // DB returns success
    updateIncident.mockResolvedValue({ updated: true });

    await updateIncidentMiddleware(fakeRequest, fakeResponse);

    expect(updateIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({ updated: true });
  });
});