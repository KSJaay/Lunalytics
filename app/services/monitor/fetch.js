import { createGetRequest } from '../axios';

const fetchMonitorById = async (monitorId, func) => {
  const monitor = await createGetRequest(`/monitor/id`, { monitorId });

  if (func) {
    func(monitor.data, fetchMonitorById);
  }

  return monitor.data;
};

export { fetchMonitorById };
