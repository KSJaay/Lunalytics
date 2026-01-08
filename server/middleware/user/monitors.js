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
    const monitors = await fetchMonitors(response.locals.user.workspaceId);
    const query = [];

    for (const monitor of monitors) {
      const heartbeats = await fetchHeartbeats(
        monitor.monitorId,
        response.locals.user.workspaceId,
        12
      );
      monitor.heartbeats = heartbeats;

      // const statusChanged = await fetchStatusChangeHeartbeats(
      //   monitor.monitorId,
      //   20
      // );

      // monitor.statusChanged = statusChanged;

      monitor.cert = { isValid: false };

      if (monitor.type === 'http') {
        const cert = await fetchCertificate(
          monitor.monitorId,
          response.locals.user.workspaceId
        );
        monitor.cert = cert;
      }

      const filters = await fetchHourlyHeartbeats(
        monitor.monitorId,
        response.locals.user.workspaceId,
        2
      );
      monitor.showFilters = filters.length === 2;

      query.push(cleanMonitor(monitor));
    }

    return response.send(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default userMonitorsMiddleware;
