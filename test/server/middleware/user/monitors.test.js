import { createRequest, createResponse } from 'node-mocks-http';
vi.mock('../../../../server/class/monitor/index.js');
vi.mock('../../../../server/database/queries/certificate.js');
vi.mock('../../../../server/database/queries/heartbeat.js');
vi.mock('../../../../server/database/queries/monitor.js');
vi.mock('../../../../server/utils/errors.js', () => ({ handleError: vi.fn() }));

import userMonitorsMiddleware from '../../../../server/middleware/user/monitors.js';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchMonitors } from '../../../../server/database/queries/monitor.js';
import {
  fetchHeartbeats,
  fetchHourlyHeartbeats,
} from '../../../../server/database/queries/heartbeat.js';
import { fetchCertificate } from '../../../../server/database/queries/certificate.js';
import { cleanMonitor } from '../../../../server/class/monitor/index.js';

describe('userMonitorsMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchMonitors = vi.fn(() =>
      Promise.resolve([{ monitorId: 'm1', type: 'http' }])
    );

    fetchHeartbeats = vi.fn(() => Promise.resolve([1, 2]));
    fetchHourlyHeartbeats = vi.fn(() => Promise.resolve([1, 2]));
    fetchCertificate = vi.fn(() => ({ isValid: true }));
    cleanMonitor = vi.fn((m) => m);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch monitors and return them', async () => {
    await userMonitorsMiddleware(fakeRequest, fakeResponse);

    expect(fetchMonitors).toHaveBeenCalled();
    expect(fetchHeartbeats).toHaveBeenCalledWith('m1', 12);
    expect(fetchHourlyHeartbeats).toHaveBeenCalledWith('m1', 2);
    expect(fetchCertificate).toHaveBeenCalledWith('m1');
    expect(cleanMonitor).toHaveBeenCalledWith({
      monitorId: 'm1',
      type: 'http',
      heartbeats: [1, 2],
      cert: { isValid: true },
      showFilters: true,
    });
    expect(fakeResponse._getData()).toEqual([
      {
        monitorId: 'm1',
        type: 'http',
        heartbeats: [1, 2],
        cert: { isValid: true },
        showFilters: true,
      },
    ]);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    fetchMonitors.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    await userMonitorsMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
