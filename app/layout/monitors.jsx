import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import ContextStore from '../context';
import { createGetRequest } from '../services/axios';
import { fetchMonitorById } from '../services/monitor/fetch';
import Modal from '../components/ui/modal';

const MonitorsLayout = ({ children }) => {
  const {
    modalStore: { isOpen, content },
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
      {isOpen && <Modal.Container glassmorph>{content}</Modal.Container>}
      {children}
    </>
  );
};

MonitorsLayout.displayName = 'MonitorsLayout';

export default observer(MonitorsLayout);
