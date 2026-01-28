import { parseJsonOrArray } from '../../utils/parser.js';
import cleanCertificate from '../certificate.js';

const clean = (
  { heartbeats = [], cert, ...monitor }: any,
  includeHeartbeats: boolean = true,
  includeCert: boolean = true
) => ({
  monitorId: monitor.monitorId,
  workspaceId: monitor.workspaceId,
  parentId: monitor.parentId || null,
  name: monitor.name,
  url: monitor.url,
  dnsResolver: monitor.dnsResolver,
  dnsRecordType: monitor.dnsRecordType,
  port: parseInt(monitor.port),
  retry: parseInt(monitor.retry),
  interval: parseInt(monitor.interval),
  retryInterval: parseInt(monitor.retryInterval),
  requestTimeout: parseInt(monitor.requestTimeout),
  email: monitor.email,
  type: monitor.type,
  notificationId: monitor.notificationId,
  notificationType: monitor.notificationType,
  uptimePercentage: monitor.uptimePercentage,
  averageHeartbeatLatency: monitor.averageHeartbeatLatency,
  showFilters: monitor.showFilters,
  paused: monitor.paused == '1',
  created_at: monitor.created_at,
  cert: includeCert ? cleanCertificate(cert) : undefined,
  heartbeats: includeHeartbeats ? heartbeats : undefined,
  statusChanged: includeHeartbeats ? monitor.statusChanged : undefined,
  icon: parseJsonOrArray(monitor.icon),
});

export default clean;
