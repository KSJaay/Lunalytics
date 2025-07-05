import { cleanMonitor } from '../../class/monitor/index.js';
import { fetchCertificate } from '../../database/queries/certificate.js';
import {
  fetchHeartbeats,
  fetchHourlyHeartbeats,
} from '../../database/queries/heartbeat.js';
import { fetchMonitors } from '../../database/queries/monitor.js';
import { handleError } from '../../utils/errors.js';

const userMonitorsMiddleware = async (request, response) => {
  try {
    const monitors = await fetchMonitors();
    const query = [];

    for (const monitor of monitors) {
      const heartbeats = await fetchHeartbeats(monitor.monitorId, 12);
      monitor.heartbeats = heartbeats;

      monitor.cert = { isValid: false };

      if (monitor.type === 'http') {
        const cert = await fetchCertificate(monitor.monitorId);
        monitor.cert = cert;
      }

      const filters = await fetchHourlyHeartbeats(monitor.monitorId, 2);
      monitor.showFilters = filters.length === 2;

      query.push(cleanMonitor(monitor));
    }

    return response.send(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default userMonitorsMiddleware;
