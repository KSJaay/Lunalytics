import { parseJsonOrArray } from '../../utils/parser.js';
import cleanCertificate from '../certificate.js';

export const clean = (
  { heartbeats = [], cert, ...monitor },
  includeHeartbeats = true,
  includeCert = true
) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  interval: parseInt(monitor.interval),
  retryInterval: parseInt(monitor.retryInterval),
  requestTimeout: parseInt(monitor.requestTimeout),
  method: monitor.method,
  headers: parseJsonOrArray(monitor.headers),
  body: parseJsonOrArray(monitor.body),
  email: monitor.email,
  type: monitor.type,
  notificationId: monitor.notificationId,
  notificationType: monitor.notificationType,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  showFilters: monitor.showFilters,
  paused: monitor.paused == '1',
  ignoreTls: monitor.ignoreTls == '1',
  json_query: parseJsonOrArray(monitor.json_query, []),
  createdAt: monitor.createdAt,
  cert: includeCert ? cleanCertificate(cert) : undefined,
  heartbeats: includeHeartbeats ? heartbeats : undefined,
});

export default clean;
