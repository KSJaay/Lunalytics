import { describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import fetchMonitorUsingId from '../../../../server/middleware/monitor/id';
import { fetchCertificate } from '../../../../server/database/queries/certificate';
import { fetchMonitor } from '../../../../server/database/queries/monitor';
import { fetchHeartbeats } from '../../../../server/database/queries/heartbeat';

vi.mock('../../../../server/database/queries/certificate');
vi.mock('../../../../server/database/queries/monitor');
vi.mock('../../../../server/database/queries/heartbeat');

describe('Fetch Monitor Using Id - Middleware', () => {
  const monitorId = 'test_monitor_id';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchCertificate = vi.fn().mockReturnValue({ isValid: false });
    fetchMonitor = vi.fn().mockReturnValue({ monitorId: 'test_monitor_id' });
    fetchHeartbeats = vi.fn().mockReturnValue([]);

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
    it('should call fetchMonitor with monitorId', async () => {
      await fetchMonitorUsingId(fakeRequest, fakeResponse);

      expect(fetchMonitor).toHaveBeenCalledWith(monitorId);
    });

    it('should return 404 when monitor is not found', async () => {
      fetchMonitor.mockReturnValue(null);

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
