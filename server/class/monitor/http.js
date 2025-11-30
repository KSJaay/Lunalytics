import { parseJsonOrArray } from '../../utils/parser.js';
import cleanCertificate from '../certificate.js';

const clean = (
  { heartbeats = [], cert, ...monitor },
  includeHeartbeats = true,
  includeCert = true
) => ({
  monitorId: monitor.monitorId,
  parentId: monitor.parentId || null,
  name: monitor.name,
  url: monitor.url,
  retry: parseInt(monitor.retry),
  interval: parseInt(monitor.interval),
  retryInterval: parseInt(monitor.retryInterval),
  requestTimeout: parseInt(monitor.requestTimeout),
  method: monitor.method,
  headers: parseJsonOrArray(monitor.headers),
  body: parseJsonOrArray(monitor.body),
  valid_status_codes: parseJsonOrArray(monitor.valid_status_codes, ['200-299']),
  email: monitor.email,
  type: monitor.type,
  notificationId: monitor.notificationId,
  notificationType: monitor.notificationType,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  showFilters: monitor.showFilters,
  paused: monitor.paused == '1',
  ignoreTls: monitor.ignoreTls == '1',
  createdAt: monitor.createdAt,
  cert: includeCert ? cleanCertificate(cert) : undefined,
  heartbeats: includeHeartbeats ? heartbeats : undefined,
  icon: parseJsonOrArray(monitor.icon),
});

export default clean;
