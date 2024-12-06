import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import fetchMonitorStatus from '../../../../server/middleware/monitor/status';
import { fetchMonitor } from '../../../../server/database/queries/monitor';
import {
  fetchDailyHeartbeats,
  fetchHeartbeats,
  fetchHourlyHeartbeats,
} from '../../../../server/database/queries/heartbeat';

vi.mock('../../../../server/database/queries/monitor');
vi.mock('../../../../server/database/queries/heartbeat');

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
    fetchMonitor = vi.fn().mockReturnValue({ monitorId });
    fetchHeartbeats = vi.fn().mockReturnValue([heartbeat, heartbeat]);
    fetchHeartbeats = vi.fn().mockReturnValue([heartbeat, heartbeat]);
    fetchHourlyHeartbeats = vi.fn().mockReturnValue([heartbeat, heartbeat]);
    fetchDailyHeartbeats = vi.fn().mockReturnValue([heartbeat, heartbeat]);

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = {
      monitorId,
      type: 'latest',
    };

    fakeResponse.json = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
        fetchDailyHeartbeats = vi.fn().mockReturnValue([]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(416);
      });

      it('should return 200 when data is valid', async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(200);
      });

      it('should call response.json with heartbeats', async () => {
        fetchDailyHeartbeats = vi.fn().mockReturnValue([heartbeat, heartbeat]);

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
        fetchHourlyHeartbeats = vi.fn().mockReturnValue([]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(416);
      });

      it('should return 200 when data is valid', async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(200);
      });

      it('should call response.json with heartbeats', async () => {
        fetchHourlyHeartbeats = vi.fn().mockReturnValue([heartbeat, heartbeat]);

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
        fetchHourlyHeartbeats = vi.fn().mockReturnValue([]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(416);
      });

      it('should return 200 when data is valid', async () => {
        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(200);
      });

      it('should call response.json with heartbeats', async () => {
        fetchHourlyHeartbeats = vi.fn().mockReturnValue([heartbeat, heartbeat]);

        await fetchMonitorStatus(fakeRequest, fakeResponse);

        expect(fakeResponse.json).toHaveBeenCalledWith([heartbeat, heartbeat]);
      });
    });
  });
});
