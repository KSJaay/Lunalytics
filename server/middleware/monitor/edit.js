// import local files
import {
  handleError,
  UnprocessableError,
} from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/monitor.js';
import cache from '../../cache/index.js';
import { userExists } from '../../database/queries/user.js';
import { cleanMonitor } from '../../class/monitor.js';

const monitorEdit = async (request, response) => {
  try {
    const { type } = request.body;

    const isHttp = type === 'http';

    const validator = isHttp ? validators.http : validators.tcp;

    const isInvalidMonitor = validator(request.body);

    if (isInvalidMonitor) {
      throw new UnprocessableError(isInvalidMonitor);
    }

    const user = await userExists(request.cookies.access_token);

    const data = await cache.monitors.addOrEdit(
      request.body,
      user.email,
      isHttp,
      true
    );

    await cache.setTimeout(data.monitorId, data.interval);

    const heartbeats = await cache.heartbeats.get(data.monitorId);
    const cert = await cache.certificates.get(data.monitorId);

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
