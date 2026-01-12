// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/monitor.js';
import cache from '../../cache/monitor/index.js';
import { cleanMonitor } from '../../class/monitor/index.js';
import { defaultMonitorData, formatMonitorData } from './add.js';
import { updateMonitor } from '../../database/queries/monitor.js';
import { fetchHeartbeats } from '../../database/queries/heartbeat.js';
import { fetchCertificate } from '../../database/queries/certificate.js';
import statusCache from '../../cache/status.js';

const monitorEdit = async (request, response) => {
  try {
    const { type } = request.body;

    const validator = validators[type];

    if (!validator) {
      throw new UnprocessableError('Invalid monitor type');
    }

    const body = defaultMonitorData(request.body);
    const isInvalidMonitor = validator(body);

    if (isInvalidMonitor) {
      throw new UnprocessableError(isInvalidMonitor);
    }

    const { user, workspaceId } = response.locals;

    const monitor_data = formatMonitorData(body, user.email, workspaceId);
    const data = await updateMonitor(monitor_data);

    cache
      .checkMonitorStatus(data.monitorId, data.workspaceId)
      ?.catch(() => false);

    const heartbeats = await fetchHeartbeats(data.monitorId, data.workspaceId);
    const cert = await fetchCertificate(data.monitorId, data.workspaceId);

    statusCache
      .reloadMonitor(data.monitorId, data.workspaceId)
      .catch(() => false);

    const monitor = cleanMonitor({
      ...data,
      heartbeats,
      cert,
    });

    return response.json(monitor);
  } catch (error) {
    return handleError(error, response);
  }
};

export default monitorEdit;
