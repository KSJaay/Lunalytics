// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/monitor.js';
import cache from '../../cache/monitor/index.js';
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

export const defaultMonitorData = (body) => ({
  name: body.name ?? 'Lunalytics',
  url: body.url,
  interval: body.interval ?? 60,
  monitorId: body.monitorId,
  parentId: body.parentId ?? null,
  retry: body.retry ?? 1,
  retryInterval: body.retryInterval ?? 60,
  requestTimeout: body.requestTimeout ?? 60,
  notificationId: body.notificationId,
  notificationType: body.notificationType,
  ignoreTls: body.ignoreTls ?? false,
  icon: body.icon ?? {
    id: 'lunalytics',
    name: 'Lunalytics',
    url: `https://cdn.jsdelivr.net/gh/selfhst/icons/svg/lunalytics.svg`,
  },
  valid_status_codes: body.valid_status_codes ?? [],
  method: body.method ?? 'GET',
  headers: body.headers ?? {},
  body: body.body ?? {},
  port: body.port,
  json_query: body.json_query ?? [{ key: '', operator: '==', value: '' }],
  type: body.type ?? 'http',
});

export const formatMonitorData = (body, email, workspaceId) => {
  let monitor = {
    name: body.name,
    url: body.url,
    interval: body.interval,
    monitorId: body.monitorId,
    workspaceId,
    parentId: body.parentId,
    retry: body.retry,
    retryInterval: body.retryInterval,
    requestTimeout: body.requestTimeout,
    notificationId: body.notificationId,
    notificationType: body.notificationType,
    ignoreTls: false,
    email,
    icon: stringifyJson(body.icon),
  };

  if (body.type === 'docker') {
    monitor = {
      ...monitor,
      valid_status_codes: '',
      type: 'docker',
    };
  } else if (body.type === 'push') {
    monitor = {
      ...monitor,
      valid_status_codes: '',
      type: 'push',
    };
  } else if (body.type === 'http') {
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

    const body = defaultMonitorData(request.body);
    const isInvalidMonitor = validator(body);

    if (isInvalidMonitor) {
      throw new UnprocessableError(isInvalidMonitor);
    }

    const { user } = response.locals;

    const monitor_data = formatMonitorData(body, user.email, user.workspaceId);
    const data = await createMonitor(monitor_data);

    cache.checkStatus(data.monitorId, data.workspaceId)?.catch(() => false);

    const heartbeats = await fetchHeartbeats(data.monitorId, data.workspaceId);
    const cert = await fetchCertificate(data.monitorId, data.workspaceId);

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
