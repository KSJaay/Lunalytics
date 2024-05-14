import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import cache from '../../../../server/cache';
import fetchMonitorStatus from '../../../../server/middleware/monitor/status';

vi.mock('../../../../server/cache');

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
    cache = {
      monitors: { get: vi.fn().mockReturnValue({ monitorId }) },
      heartbeats: {
        get: vi.fn().mockReturnValue(true),
        getRealtime: vi.fn().mockReturnValue([heartbeat, heartbeat]),
        getDaily: vi.fn().mockReturnValue([heartbeat, heartbeat]),
        getWeekly: vi.fn().mockReturnValue([heartbeat, heartbeat]),
        getMonthly: vi.fn().mockReturnValue([heartbeat, heartbeat]),
      },
    };

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
    it('should call cache.monitors.get with monitorId', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);

      expect(cache.monitors.get).toHaveBeenCalledWith(monitorId);
    });

    it('should call cache.heartbeats.getRealtime with monitorId', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);

      expect(cache.heartbeats.getRealtime).toHaveBeenCalledWith(monitorId);
    });

    it('should return 200 when data is valid', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(200);
    });

    it('should call response.json with heartbeats', async () => {
      await fetchMonitorStatus(fakeRequest, fakeResponse);

      expect(fakeResponse.json).toHaveBeenCalledWith([heartbeat, heartbeat]);
    });

    [
      { type: 'day', funcName: 'getDaily' },
      { type: 'week', funcName: 'getWeekly' },
      { type: 'month', funcName: 'getMonthly' },
    ].forEach(({ type, funcName }) =>
      describe(`when type is ${type}`, () => {
        beforeEach(() => {
          fakeRequest.query.type = type;
        });

        it(`should call cache.heartbeats.${funcName} with monitorId`, async () => {
          await fetchMonitorStatus(fakeRequest, fakeResponse);

          expect(cache.heartbeats[funcName]).toHaveBeenCalledWith(monitorId);
        });

        it('should return 416 when heartbeats are less than two', async () => {
          cache.heartbeats[funcName] = vi.fn().mockReturnValue([]);

          await fetchMonitorStatus(fakeRequest, fakeResponse);

          expect(fakeResponse.statusCode).toEqual(416);
        });

        it('should return 200 when data is valid', async () => {
          await fetchMonitorStatus(fakeRequest, fakeResponse);

          expect(fakeResponse.statusCode).toEqual(200);
        });

        it('should call response.json with heartbeats', async () => {
          cache.heartbeats[funcName] = vi
            .fn()
            .mockReturnValue([heartbeat, heartbeat]);

          await fetchMonitorStatus(fakeRequest, fakeResponse);

          expect(fakeResponse.json).toHaveBeenCalledWith([
            heartbeat,
            heartbeat,
          ]);
        });
      })
    );
  });
});
