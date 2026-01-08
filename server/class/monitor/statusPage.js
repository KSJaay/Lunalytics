import { parseJsonOrArray } from '../../utils/parser.js';

export const cleanMonitorForStatusPage = (monitor) => ({
  monitorId: monitor.monitorId,
  workspaceId: monitor.workspaceId,
  name: monitor.name,
  created_at: monitor.created_at,
  paused: monitor.paused == '1',
  icon: parseJsonOrArray(monitor.icon),
  isDown: monitor.isDown ? true : false,
});
