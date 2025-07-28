// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/monitor.js';
import cache from '../../cache/index.js';
import { cleanMonitor } from '../../class/monitor/index.js';
import { createMonitor } from '../../database/queries/monitor.js';
import { fetchHeartbeats } from '../../database/queries/heartbeat.js';
import { fetchCertificate } from '../../database/queries/certificate.js';

const stringifyJson = (obj, asArray = false) => {
  try {
    if (typeof obj === 'string') {
      return obj;
    }

    return JSON.stringify(obj);
  } catch {
    return asArray ? '[]' : '{}';
  }
};

export const formatMonitorData = (body, email) => {
  let monitor = {
    name: body.name,
    url: body.url,
    interval: body.interval,
    monitorId: body.monitorId,
    retry: body.retry,
    retryInterval: body.retryInterval,
    requestTimeout: body.requestTimeout,
    notificationId: body.notificationId,
    notificationType: body.notificationType,
    ignoreTls: false,
    email,
  };

  if (body.type === 'http') {
    monitor = {
      ...monitor,
      method: body.method,
      valid_status_codes: stringifyJson(body.valid_status_codes, true),
      headers: stringifyJson(body.headers),
      body: stringifyJson(body.body),
      type: 'http',
      ignoreTls: body.ignoreTls,
    };
  } else if (body.type === 'tcp') {
    monitor = {
      ...monitor,
      port: body.port,
      valid_status_codes: '',
      type: 'tcp',
    };
  } else if (body.type === 'ping') {
    monitor = {
      ...monitor,
      valid_status_codes: '',
      type: 'ping',
    };
  } else if (body.type === 'json') {
    monitor = {
      ...monitor,
      method: body.method,
      headers: stringifyJson(body.headers),
      body: stringifyJson(body.body),
      type: 'json',
      ignoreTls: body.ignoreTls,
      json_query: stringifyJson(body.json_query, true),
    };
  }

  return monitor;
};

const monitorAdd = async (request, response) => {
  try {
    const { type } = request.body;

    const validator = validators[type];

    if (!validator) {
      throw new UnprocessableError('Invalid monitor type');
    }

    const isInvalidMonitor = validator(request.body);

    if (isInvalidMonitor) {
      throw new UnprocessableError(isInvalidMonitor);
    }

    const { user } = response.locals;

    const montior_data = formatMonitorData(request.body, user.email);
    const data = await createMonitor(montior_data);

    cache.checkStatus(data.monitorId)?.catch(() => false);

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
