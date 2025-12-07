/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database Queries
jest.mock('../../../../server/database/queries/incident.js', () => ({
  fetchAllIncidents: jest.fn(),
}));

// Mock Logger
jest.mock('../../../../server/utils/logger.js', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import getAllIncidents from '../../../../server/middleware/incident/getAll.js';
import { fetchAllIncidents } from '../../../../server/database/queries/incident.js';
import logger from '../../../../server/utils/logger.js';

describe('getAllIncidents', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Setup spies
    fakeResponse.json = jest.fn();
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.send = jest.fn().mockReturnThis();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return incidents on success', async () => {
    fetchAllIncidents.mockResolvedValue([{ id: 1 }]);

    await getAllIncidents(fakeRequest, fakeResponse);

    expect(fakeResponse.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('should handle errors and log', async () => {
    // Force DB Error
    fetchAllIncidents.mockRejectedValue(new Error('fail'));

    await getAllIncidents(fakeRequest, fakeResponse);

    expect(logger.error).toHaveBeenCalled();
    expect(fakeResponse.status).toHaveBeenCalledWith(500);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'Something went wrong',
    });
  });
});