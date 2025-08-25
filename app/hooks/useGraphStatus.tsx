// import dependencies
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// import local files
import { createGetRequest } from '../services/axios';
import type { HeartbeatProps, MonitorProps } from '../types/monitor';

const useGraphStatus = (monitor: MonitorProps) => {
  const [statusType, setStatus] = useState('latest');
  const [statusHeartbeats, setHeartbeats] = useState(monitor.heartbeats || []);

  useEffect(() => {
    const fetchMonitorHeartbeats = async () => {
      try {
        const query = await createGetRequest('/api/monitor/status', {
          monitorId: monitor.monitorId,
          type: statusType,
        });

        if (query.status === 200) {
          return setStatusHeartbeats(query.data);
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch monitor heartbeats');
      }
    };

    fetchMonitorHeartbeats();
  }, [statusType, monitor]);

  const setStatusType = (statusType: string) => {
    setStatus(statusType);
  };

  const setStatusHeartbeats = (statusHeartbeats: HeartbeatProps[]) => {
    setHeartbeats(statusHeartbeats);
  };

  return {
    statusType: statusType,
    statusHeartbeats: statusHeartbeats,
    setStatusType,
    setStatusHeartbeats,
  };
};

export default useGraphStatus;
