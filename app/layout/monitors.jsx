import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import ContextStore from '../context';
import { createGetRequest } from '../services/axios';
import { fetchMonitorById } from '../services/monitor/fetch';

const MonitorsLayout = ({ children }) => {
  const {
    globalStore: { setMonitors, setTimeouts },
  } = useContext(ContextStore);

  const fetchMontiors = async () => {
    const query = await createGetRequest('/user/monitors');
    const data = query?.data || [];

    setMonitors(data);
    setTimeouts(data, fetchMonitorById);
  };

  useEffect(() => {
    fetchMontiors();
  }, []);

  return children;
};

MonitorsLayout.displayName = 'MonitorsLayout';

export default observer(MonitorsLayout);
