import { describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import monitorDelete from '../../../../server/middleware/monitor/delete';
import { deleteMonitor } from '../../../../server/database/queries/monitor';
import { deleteHeartbeats } from '../../../../server/database/queries/heartbeat';
import { deleteCertificate } from '../../../../server/database/queries/certificate';

vi.mock('../../../../server/database/queries/monitor');
vi.mock('../../../../server/database/queries/heartbeat');
vi.mock('../../../../server/database/queries/certificate');

describe('Delete Monitor - Middleware', () => {
  const monitorId = 'test_monitor_id';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
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
  });
});
