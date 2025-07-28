const clean = ({ heartbeats = [], ...monitor }, includeHeartbeats = true) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  retry: parseInt(monitor.retry),
  interval: parseInt(monitor.interval),
  retryInterval: parseInt(monitor.retryInterval),
  requestTimeout: parseInt(monitor.requestTimeout),
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
  heartbeats: includeHeartbeats ? heartbeats : undefined,
});

export default clean;
