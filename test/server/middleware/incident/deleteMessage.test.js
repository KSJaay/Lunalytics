/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

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

// Mock Error Handler
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import deleteIncidentMessageMiddleware from '../../../../server/middleware/incident/deleteMessage.js';
import {
  fetchIncident,
  updateIncident,
} from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';

describe('deleteIncidentMessageMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { incidentId: 'id', position: 0 };
    
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
    // Return empty messages array, so position 0 is invalid
    fetchIncident.mockResolvedValue({ messages: [] });

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Message not found',
    });
  });

  it('should return 404 if only one message (cannot delete last message)', async () => {
    fakeRequest.body.position = 0;
    
    // Return array with only 1 item
    fetchIncident.mockResolvedValue({ messages: [{}] });

    await deleteIncidentMessageMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.json).toHaveBeenCalledWith({
      message: 'Need to have at least one message',
    });
  });

  it('should update incident and return data if valid', async () => {
    // Setup: 2 messages. We delete index 0 ('old'), leaving index 1 ('new').
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
    
    // Expect the logic to have picked up the status from the remaining message ('new')
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