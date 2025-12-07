/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Database Queries (Monitor)
jest.mock('../../../../server/database/queries/monitor', () => ({
  fetchMonitor: jest.fn(),
}));

// Mock Database Queries (Heartbeat)
jest.mock('../../../../server/database/queries/heartbeat', () => ({
  fetchDailyHeartbeats: jest.fn(),
  fetchHeartbeats: jest.fn(),
  fetchHourlyHeartbeats: jest.fn(),
}));

// Mock SQLite Setup (Safety)
jest.mock('../../../../server/database/sqlite/setup', () => ({
  __esModule: true,
  default: {
    client: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import fetchMonitorStatus from '../../../../server/middleware/monitor/status';
import { fetchMonitor } from '../../../../server/database/queries/monitor';
import {
  fetchDailyHeartbeats,
  fetchHeartbeats,
  fetchHourlyHeartbeats,
} from '../../../../server/database/queries/heartbeat';

describe('Fetch Monitor Status - Middleware', () => {
  const monitorId = 'test_monitor_id';

  let fakeRequest;
  let fakeResponse;

  const heartbeat = {
    monitorId,
    latency: 20,
    createdAt: 'date goes here',
  };

  beforeEach(() => {
    // Reset call counts
    jest.clearAllMocks();

    // --- 3. SETUP DEFAULT MOCK RETURNS ---
    // Use mockResolvedValue because database calls are async
    fetchMonitor.mockResolvedValue({ monitorId });
    
    // Default success: return 2 heartbeats so checks pass
    fetchHeartbeats.mockResolvedValue([heartbeat, heartbeat]);
    fetchHourlyHeartbeats.mockResolvedValue([heartbeat, heartbeat]);
    fetchDailyHeartbeats.mockResolvedValue([heartbeat, heartbeat]);

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = {
      monitorId,
      type: 'latest',
    };

    fakeResponse.json = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when monitorId is invalid', () => {
    it('should return 422 when monitorId is invalid', async () => {
      fakeRequest.query.monitorId = null;

      await fetchMonitorStatus(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });

    it('should return 422 when type is invalid', async () => {
      fakeRequest.query.type = null;

      await fetchMonitorStatus(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('when monitorId is valid', () => {
    it('should call fetchMonitor with monitorId', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);
      expect(fetchMonitor).toHaveBeenCalledWith(monitorId);
    });

    it('should call fetchHeartbeats with monitorId', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);
      expect(fetchHeartbeats).toHaveBeenCalledWith(monitorId);
    });

    it('should return 200 when data is valid', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);
      expect(fakeResponse.statusCode).toEqual(200);
    });

    it('should call response.json with heartbeats', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);
      expect(fakeResponse.json).toHaveBeenCalledWith([heartbeat, heartbeat]);
    });

    describe(`when type is day`, () => {
      beforeEach(() => {
        fakeRequest.query.type = 'day';
      });

      it(`should call fetchDailyHeartbeats with monitorId`, async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);
        expect(fetchDailyHeartbeats).toHaveBeenCalledWith(monitorId);
      });

      it('should return 416 when heartbeats are less than two', async () => {
        // Change mock behavior for this specific test
        fetchDailyHeartbeats.mockResolvedValue([]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(416);
      });

      it('should return 200 when data is valid', async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);
        expect(fakeResponse.statusCode).toEqual(200);
      });

      it('should call response.json with heartbeats', async () => {
        // Ensure mock returns data
        fetchDailyHeartbeats.mockResolvedValue([heartbeat, heartbeat]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.json).toHaveBeenCalledWith([heartbeat, heartbeat]);
      });
    });

    describe(`when type is week`, () => {
      beforeEach(() => {
        fakeRequest.query.type = 'week';
      });

      it(`should call fetchHourlyHeartbeats with monitorId`, async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);
        expect(fetchHourlyHeartbeats).toHaveBeenCalledWith(monitorId, 168);
      });

      it('should return 416 when heartbeats are less than two', async () => {
        fetchHourlyHeartbeats.mockResolvedValue([]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(416);
      });

      it('should return 200 when data is valid', async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);
        expect(fakeResponse.statusCode).toEqual(200);
      });

      it('should call response.json with heartbeats', async () => {
        fetchHourlyHeartbeats.mockResolvedValue([heartbeat, heartbeat]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.json).toHaveBeenCalledWith([heartbeat, heartbeat]);
      });
    });

    describe(`when type is month`, () => {
      beforeEach(() => {
        fakeRequest.query.type = 'month';
      });

      it(`should call fetchHourlyHeartbeats with monitorId`, async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);
        expect(fetchHourlyHeartbeats).toHaveBeenCalledWith(monitorId, 720);
      });

      it('should return 416 when heartbeats are less than two', async () => {
        fetchHourlyHeartbeats.mockResolvedValue([]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(416);
      });

      it('should return 200 when data is valid', async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);
        expect(fakeResponse.statusCode).toEqual(200);
      });

      it('should call response.json with heartbeats', async () => {
        fetchHourlyHeartbeats.mockResolvedValue([heartbeat, heartbeat]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.json).toHaveBeenCalledWith([heartbeat, heartbeat]);
      });
    });
  });
});