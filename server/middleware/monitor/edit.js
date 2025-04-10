// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/monitor.js';
import cache from '../../cache/index.js';
import { cleanMonitor } from '../../class/monitor.js';
import { getTcpOrHttpData } from './add.js';
import { updateMonitor } from '../../database/queries/monitor.js';
import { fetchHeartbeats } from '../../database/queries/heartbeat.js';
import { fetchCertificate } from '../../database/queries/certificate.js';

const monitorEdit = async (request, response) => {
  try {
    const { type } = request.body;

    const isHttp = type === 'http';
    const validator = isHttp ? validators.http : validators.tcp;
    const isInvalidMonitor = validator(request.body);

    if (isInvalidMonitor) {
      throw new UnprocessableError(isInvalidMonitor);
    }

    const { user } = response.locals;

    const montior_data = getTcpOrHttpData(request.body, user.email, isHttp);
    const data = await updateMonitor(montior_data);

    await cache.checkStatus(data.monitorId);

    const heartbeats = await fetchHeartbeats(data.monitorId);
    const cert = await fetchCertificate(data.monitorId);

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
