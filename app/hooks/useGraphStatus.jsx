// import dependencies
import { toast } from 'sonner';

// import local files
import { useEffect, useState } from 'react';
import { createGetRequest } from '../services/axios';

const useGraphStatus = (monitor = {}) => {
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
        toast.error('Failed to fetch monitor heartbeats');
      }
    };

    fetchMonitorHeartbeats();
  }, [statusType]);

  const setStatusType = (statusType) => {
    setStatus(statusType);
  };

  const setStatusHeartbeats = (statusHeartbeats) => {
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
