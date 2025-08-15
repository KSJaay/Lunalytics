import { createGetRequest } from '../axios';

const fetchMonitorById = async (monitorId: string, func?: Function) => {
  const monitor = await createGetRequest('/api/monitor/id', { monitorId });

  if (func) {
    func(monitor.data, fetchMonitorById);
  }

  return monitor.data;
};

export { fetchMonitorById };
