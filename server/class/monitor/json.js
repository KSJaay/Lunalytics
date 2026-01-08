import { parseJsonOrArray } from '../../utils/parser.js';
import cleanCertificate from '../certificate.js';

export const clean = (
  { heartbeats = [], cert, ...monitor },
  includeHeartbeats = true,
  includeCert = true
) => ({
  monitorId: monitor.monitorId,
  workspaceId: monitor.workspaceId,
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
  created_at: monitor.created_at,
  cert: includeCert ? cleanCertificate(cert) : undefined,
  heartbeats: includeHeartbeats ? heartbeats : undefined,
  statusChanged: includeHeartbeats ? monitor.statusChanged : undefined,
  icon: parseJsonOrArray(monitor.icon),
});

export default clean;
