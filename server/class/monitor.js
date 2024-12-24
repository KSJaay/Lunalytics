import cleanCertificate from './certificate.js';

const parseJsonStatus = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return ['200-299'];
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
  headers: monitor.headers,
  body: monitor.body,
  valid_status_codes: parseJsonStatus(monitor.valid_status_codes),
  email: monitor.email,
  type: monitor.type,
  port: monitor.port,
  notificationId: monitor.notificationId,
  notificationType: monitor.notificationType,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  showFilters: monitor.showFilters == '1',
  paused: monitor.paused == '1',
});

export const cleanMonitor = ({ heartbeats = [], cert, ...monitor }) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  interval: parseInt(monitor.interval),
  retryInterval: parseInt(monitor.retryInterval),
  requestTimeout: parseInt(monitor.requestTimeout),
  method: monitor.method,
  headers: monitor.headers,
  body: monitor.body,
  valid_status_codes: parseJsonStatus(monitor.valid_status_codes),
  email: monitor.email,
  type: monitor.type,
  port: monitor.port,
  notificationId: monitor.notificationId,
  notificationType: monitor.notificationType,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  showFilters: monitor.showFilters == '1',
  paused: monitor.paused == '1',
  cert: !cert?.isValid ? cert : cleanCertificate(cert),
  heartbeats,
});
