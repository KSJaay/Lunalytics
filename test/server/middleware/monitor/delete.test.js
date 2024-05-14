import { describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import cache from '../../../../server/cache';
import monitorDelete from '../../../../server/middleware/monitor/delete';

vi.mock('../../../../server/cache');

describe('Delete Monitor - Middleware', () => {
  const monitorId = 'test_monitor_id';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    cache = {
      monitors: { delete: vi.fn() },
      heartbeats: { delete: vi.fn() },
      certificates: { delete: vi.fn() },
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

      await monitorDelete(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(422);
    });
  });

  describe('when monitorId is valid', () => {
    it('should call cache.monitors.delete with monitorId', async () => {
      await monitorDelete(fakeRequest, fakeResponse);

      expect(cache.monitors.delete).toHaveBeenCalledWith(monitorId);
    });

    it('should call cache.heartbeats.delete with monitorId', async () => {
      await monitorDelete(fakeRequest, fakeResponse);

      expect(cache.heartbeats.delete).toHaveBeenCalledWith(monitorId);
    });

    it('should call cache.certificates.delete with monitorId', async () => {
      await monitorDelete(fakeRequest, fakeResponse);

      expect(cache.certificates.delete).toHaveBeenCalledWith(monitorId);
    });
  });
});
