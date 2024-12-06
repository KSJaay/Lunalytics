import { cleanMonitor } from '../../class/monitor.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { fetchMonitor } from '../../database/queries/monitor.js';
import { fetchCertificate } from '../../database/queries/certificate.js';
import { fetchHeartbeats } from '../../database/queries/heartbeat.js';

const fetchMonitorUsingId = async (request, response) => {
  try {
    const { monitorId } = request.query;

    if (!monitorId) {
      throw new UnprocessableError('No monitorId provided');
    }

    const data = await fetchMonitor(monitorId);

    if (!data) {
      return response.status(404).json({ error: 'Monitor not found' });
    }

    const heartbeats = await fetchHeartbeats(data.monitorId);
    const cert = await fetchCertificate(data.monitorId);

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
