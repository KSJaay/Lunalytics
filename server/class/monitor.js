import cleanCertificate from './certificate.js';

const parseJsonStatus = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return ['200-299'];
  }
};

const parseJson = (str) => {
  try {
    if (!str) return {};
    if (typeof str === 'string') {
      return JSON.parse(str);
    }
    if (typeof str === 'object') {
      if (Array.isArray(str)) return {};
      return str;
    }

    return {};
  } catch {
    return {};
  }
};

export const cleanPartialMonitor = (monitor) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  interval: parseInt(monitor.interval),
  retryInterval: parseInt(monitor.retryInterval),
  requestTimeout: parseInt(monitor.requestTimeout),
  method: monitor.method,
  headers: parseJson(monitor.headers),
  body: parseJson(monitor.body),
  valid_status_codes: parseJsonStatus(monitor.valid_status_codes),
  email: monitor.email,
  type: monitor.type,
  port: monitor.port,
  notificationId: monitor.notificationId,
  notificationType: monitor.notificationType,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  showFilters: monitor.showFilters,
  paused: monitor.paused == '1',
  createdAt: monitor.createdAt,
});

export const cleanMonitor = ({ heartbeats = [], cert, ...monitor }) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  interval: parseInt(monitor.interval),
  retryInterval: parseInt(monitor.retryInterval),
  requestTimeout: parseInt(monitor.requestTimeout),
  method: monitor.method,
  headers: parseJson(monitor.headers),
  body: parseJson(monitor.body),
  valid_status_codes: parseJsonStatus(monitor.valid_status_codes),
  email: monitor.email,
  type: monitor.type,
  port: monitor.port,
  notificationId: monitor.notificationId,
  notificationType: monitor.notificationType,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  showFilters: monitor.showFilters,
  paused: monitor.paused == '1',
  createdAt: monitor.createdAt,
  cert: !cert?.isValid ? cert : cleanCertificate(cert),
  heartbeats,
});

export const cleanMonitorForStatusPage = (monitor) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  createdAt: monitor.createdAt,
});
