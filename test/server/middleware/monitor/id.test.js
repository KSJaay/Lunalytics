/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database Queries (Certificate)
jest.mock('../../../../server/database/queries/certificate', () => ({
  fetchCertificate: jest.fn(),
}));

// Mock Database Queries (Monitor)
jest.mock('../../../../server/database/queries/monitor', () => ({
  fetchMonitor: jest.fn(),
}));

// Mock Database Queries (Heartbeat)
jest.mock('../../../../server/database/queries/heartbeat', () => ({
  fetchHeartbeats: jest.fn(),
}));

// Mock SQLite Setup (Safety mock to prevent connection attempts)
jest.mock('../../../../server/database/sqlite/setup', () => ({
  __esModule: true,
  default: {
    client: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import fetchMonitorUsingId from '../../../../server/middleware/monitor/id';
import { fetchCertificate } from '../../../../server/database/queries/certificate';
import { fetchMonitor } from '../../../../server/database/queries/monitor';
import { fetchHeartbeats } from '../../../../server/database/queries/heartbeat';

describe('Fetch Monitor Using Id - Middleware', () => {
  const monitorId = 'test_monitor_id';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    // Reset call counts
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // --- 3. SETUP DEFAULT MOCK RETURNS ---
    // Use mockResolvedValue because database calls are async
    fetchCertificate.mockResolvedValue({ isValid: false });
    fetchMonitor.mockResolvedValue({ monitorId: 'test_monitor_id' });
    fetchHeartbeats.mockResolvedValue([]);

    fakeRequest.query = {
      monitorId,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when monitorId is invalid', () => {
    it('should return 422 when monitorId is invalid', async () => {
      fakeRequest.query.monitorId = null;

      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('when monitorId is valid', () => {
    it('should call fetchMonitor with monitorId', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);
      expect(fetchMonitor).toHaveBeenCalledWith(monitorId);
    });

    it('should return 404 when monitor is not found', async () => {
      // Override the default mock for this specific test
      fetchMonitor.mockResolvedValue(null);

      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(404);
    });

    it('should call fetchHeartbeats with monitorId', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);
      expect(fetchHeartbeats).toHaveBeenCalledWith(monitorId);
    });

    it('should call fetchCertificate with monitorId', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);
      expect(fetchCertificate).toHaveBeenCalledWith(monitorId);
    });

    it('should return 200 when data is valid', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});