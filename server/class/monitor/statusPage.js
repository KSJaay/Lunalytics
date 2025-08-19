import { parseJsonOrArray } from '../../utils/parser.js';

export const cleanMonitorForStatusPage = (monitor) => ({
  monitorId: monitor.monitorId,
  name: monitor.name,
  url: monitor.url,
  createdAt: monitor.createdAt,
  paused: monitor.paused == '1',
  icon: parseJsonOrArray(monitor.icon),
});
