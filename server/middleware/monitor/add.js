// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/monitor.js';
import cache from '../../cache/index.js';
import { cleanMonitor } from '../../class/monitor.js';
import { createMonitor } from '../../database/queries/monitor.js';
import { fetchHeartbeats } from '../../database/queries/heartbeat.js';
import { fetchCertificate } from '../../database/queries/certificate.js';

const stringifyJson = (obj) => {
  try {
    if (typeof obj === 'string') {
      return obj;
    }

    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
};

export const getTcpOrHttpData = (body, email, isHttp) => {
  let monitor = {
    name: body.name,
    url: body.url,
    interval: body.interval,
    monitorId: body.monitorId,
    retryInterval: body.retryInterval,
    requestTimeout: body.requestTimeout,
    notificationId: body.notificationId,
    notificationType: body.notificationType,
    email,
  };

  if (isHttp) {
    monitor = {
      ...monitor,
      method: body.method,
      valid_status_codes: JSON.stringify(body.valid_status_codes),
      headers: stringifyJson(body.headers),
      body: stringifyJson(body.body),
      type: 'http',
    };
  } else {
    monitor = {
      ...monitor,
      port: body.port,
      valid_status_codes: '',
      type: 'tcp',
    };
  }

  return monitor;
};

const monitorAdd = async (request, response) => {
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
    const data = await createMonitor(montior_data);

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

export default monitorAdd;
