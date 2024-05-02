import cache from '../../cache/index.js';
import { cleanMonitor } from '../../class/monitor.js';
import { handleError } from '../../utils/errors.js';

const fetchMonitorUsingId = async (request, response) => {
  try {
    const { monitorId } = request.query;

    if (!monitorId) {
      return response.status(400).json({ error: 'No monitorId provided' });
    }

    const data = await cache.monitors.get(monitorId);
    const heartbeats = await cache.heartbeats.get(data.monitorId);
    const cert = await cache.certificates.get(data.monitorId);

    const monitor = cleanMonitor({
      ...data,
      heartbeats,
      cert,
    });

    return response.json(monitor);
  } catch (error) {
    handleError(error, response);
  }
};

export default fetchMonitorUsingId;
