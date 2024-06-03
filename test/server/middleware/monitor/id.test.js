import { describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import cache from '../../../../server/cache';
import fetchMonitorUsingId from '../../../../server/middleware/monitor/id';

vi.mock('../../../../server/cache');

describe('Fetch Monitor Using Id - Middleware', () => {
  const monitorId = 'test_monitor_id';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    cache = {
      monitors: { get: vi.fn().mockReturnValue({ monitorId }) },
      heartbeats: { get: vi.fn().mockReturnValue({ isValid: false }) },
      certificates: { get: vi.fn().mockReturnValue([]) },
    };

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.query = {
      monitorId,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when monitorId is invalid', () => {
    it('should return 422 when monitorId is invalid', async () => {
      fakeRequest.query.monitorId = null;

      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('when monitorId is valid', () => {
    it('should call cache.monitors.get with monitorId', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(cache.monitors.get).toHaveBeenCalledWith(monitorId);
    });

    it('should return 404 when monitor is not found', async () => {
      cache.monitors.get.mockReturnValue(null);

      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(404);
    });

    it('should call cache.heartbeats.get with monitorId', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(cache.heartbeats.get).toHaveBeenCalledWith(monitorId);
    });

    it('should call cache.certificates.get with monitorId', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(cache.certificates.get).toHaveBeenCalledWith(monitorId);
    });

    it('should return 200 when data is valid', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(200);
    });
  });
});
