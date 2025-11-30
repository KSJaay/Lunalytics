import { parseJsonOrArray } from '../../utils/parser.js';

const clean = ({ heartbeats = [], ...monitor }, includeHeartbeats = true) => ({
  monitorId: monitor.monitorId,
  parentId: monitor.parentId || null,
  name: monitor.name,
  url: monitor.url,
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
  ignoreTls: monitor.ignoreTls == '1',
  createdAt: monitor.createdAt,
  heartbeats: includeHeartbeats ? heartbeats : undefined,
  icon: parseJsonOrArray(monitor.icon),
});

export default clean;
