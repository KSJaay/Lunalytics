// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { MONITOR_ERRORS } from '../../../shared/constants/errors/monitor.js';
import { deleteCertificate } from '../../database/queries/certificate.js';
import { deleteHeartbeats } from '../../database/queries/heartbeat.js';
import { deleteMonitor } from '../../database/queries/monitor.js';
import statusCache from '../../cache/status.js';

const monitorDelete = async (request, response) => {
  try {
    const { monitorId } = request.query;

    if (!monitorId) {
      return response.status(400).json(MONITOR_ERRORS.M004);
    }

    await deleteMonitor(monitorId, response.locals.workspaceId);
    await deleteHeartbeats(monitorId, response.locals.workspaceId);
    await deleteCertificate(monitorId, response.locals.workspaceId);

    statusCache.removeMonitor(monitorId, response.locals.workspaceId);
    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default monitorDelete;
