import cleanCertificate from './certificate.js';

const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return '';
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
  valid_status_codes: parseJson(monitor.valid_status_codes),
  email: monitor.email,
  type: monitor.type,
  port: monitor.port,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
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
  valid_status_codes: parseJson(monitor.valid_status_codes),
  email: monitor.email,
  type: monitor.type,
  port: monitor.port,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  lastCheck: monitor.lastCheck,
  nextCheck: monitor.nextCheck,
  cert: !cert?.isValid ? cert : cleanCertificate(cert),
  heartbeats,
});
