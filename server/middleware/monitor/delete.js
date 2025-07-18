// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { deleteCertificate } from '../../database/queries/certificate.js';
import { deleteHeartbeats } from '../../database/queries/heartbeat.js';
import { deleteMonitor } from '../../database/queries/monitor.js';
import statusCache from '../../cache/status.js';

const monitorDelete = async (request, response) => {
  try {
    const { monitorId } = request.query;

    if (!monitorId) {
      throw new UnprocessableError('No monitorId provided');
    }

    await deleteMonitor(monitorId);
    await deleteHeartbeats(monitorId);
    await deleteCertificate(monitorId);

    statusCache.removeMonitor(monitorId);

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default monitorDelete;
