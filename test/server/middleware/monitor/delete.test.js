/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database Queries (Monitor)
jest.mock('../../../../server/database/queries/monitor', () => ({
  deleteMonitor: jest.fn(),
}));

// Mock Database Queries (Heartbeat)
jest.mock('../../../../server/database/queries/heartbeat', () => ({
  deleteHeartbeats: jest.fn(),
}));

// Mock Database Queries (Certificate)
jest.mock('../../../../server/database/queries/certificate', () => ({
  deleteCertificate: jest.fn(),
}));

// Mock SQLite Setup (To prevent side effects/crashes)
jest.mock('../../../../server/database/sqlite/setup', () => ({
  __esModule: true,
  default: {
    client: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import monitorDelete from '../../../../server/middleware/monitor/delete';
import { deleteMonitor } from '../../../../server/database/queries/monitor';
import { deleteHeartbeats } from '../../../../server/database/queries/heartbeat';
import { deleteCertificate } from '../../../../server/database/queries/certificate';

describe('Delete Monitor - Middleware', () => {
  const monitorId = 'test_monitor_id';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    // Clear mocks before every test to reset call counts
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = {
      monitorId,
    };

    // --- 3. SETUP MOCK RETURNS ---
    // Ensure the DB queries return resolved promises to prevent crashes
    deleteMonitor.mockResolvedValue(true);
    deleteHeartbeats.mockResolvedValue(true);
    deleteCertificate.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when monitorId is invalid', () => {
    it('should return 422 when monitorId is invalid', async () => {
      fakeRequest.query.monitorId = null;

      await monitorDelete(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('when monitorId is valid', () => {
    it('should call deleteMonitor with monitorId', async () => {
      await monitorDelete(fakeRequest, fakeResponse);
      expect(deleteMonitor).toHaveBeenCalledWith(monitorId);
    });

    it('should call deleteHeartbeats with monitorId', async () => {
      await monitorDelete(fakeRequest, fakeResponse);
      expect(deleteHeartbeats).toHaveBeenCalledWith(monitorId);
    });

    it('should call deleteCertificate with monitorId', async () => {
      await monitorDelete(fakeRequest, fakeResponse);
      expect(deleteCertificate).toHaveBeenCalledWith(monitorId);
    });

    // --- 4. SUCCESS CHECK ---
    it('should return 200 when deletion is successful', async () => {
      await monitorDelete(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});