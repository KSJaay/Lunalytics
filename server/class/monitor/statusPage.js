export const cleanMonitorForStatusPage = (monitor) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  createdAt: monitor.createdAt,
});
