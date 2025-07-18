// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/monitor.js';
import cache from '../../cache/index.js';
import { cleanMonitor } from '../../class/monitor/index.js';
import { formatMonitorData } from './add.js';
import { updateMonitor } from '../../database/queries/monitor.js';
import { fetchHeartbeats } from '../../database/queries/heartbeat.js';
import { fetchCertificate } from '../../database/queries/certificate.js';
import statusCache from '../../cache/status.js';

const monitorEdit = async (request, response) => {
  try {
    const { type } = request.body;

    const validator = validators[type];
    const isInvalidMonitor = validator(request.body);

    if (isInvalidMonitor) {
      throw new UnprocessableError(isInvalidMonitor);
    }

    const { user } = response.locals;

    const montior_data = formatMonitorData(request.body, user.email);
    const data = await updateMonitor(montior_data);

    cache.checkStatus(data.monitorId)?.catch(() => false);

    const heartbeats = await fetchHeartbeats(data.monitorId);
    const cert = await fetchCertificate(data.monitorId);

    statusCache.reloadMonitor(data.monitorId).catch(() => false);

    const monitor = cleanMonitor({
      ...data,
      heartbeats,
      cert,
    });

    return response.json(monitor);
  } catch (error) {
    console.log('error123', error);
    return handleError(error, response);
  }
};

export default monitorEdit;
