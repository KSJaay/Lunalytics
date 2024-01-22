import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import ContextStore from '../context';
import { createGetRequest } from '../services/axios';
import { fetchMonitorById } from '../services/monitor/fetch';
import AlertBox from '../components/ui/modal/alert';

const MonitorsLayout = ({ children }) => {
  const {
    alertBoxStore: { isOpen, content },
    globalStore: { setMonitors, setTimeouts },
  } = useContext(ContextStore);

  const fetchMontiors = async () => {
    const query = await createGetRequest('/api/user/monitors');
    const data = query?.data || [];

    setMonitors(data);
    setTimeouts(data, fetchMonitorById);
  };

  useEffect(() => {
    fetchMontiors();
  }, []);

  return (
    <>
      {isOpen && <AlertBox.Container glassmorph>{content}</AlertBox.Container>}
      {children}
    </>
  );
};

MonitorsLayout.displayName = 'MonitorsLayout';

export default observer(MonitorsLayout);
