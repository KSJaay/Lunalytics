// import dependencies
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import local files
import ContextStore from '../context';
import Modal from '../components/ui/modal';
import { createGetRequest } from '../services/axios';
import { fetchMonitorById } from '../services/monitor/fetch';

const MonitorsLayout = ({ children }) => {
  const {
    modalStore: { isOpen, content, glassmorph },
    globalStore: { setMonitors, setTimeouts },
    userStore: { setUser },
  } = useContext(ContextStore);

  const navigate = useNavigate();

  const fetchMontiors = async () => {
    try {
      const user = await createGetRequest('/api/user');
      const monitors = await createGetRequest('/api/user/monitors');
      const data = monitors?.data || [];

      setUser(user?.data);
      setMonitors(data);
      setTimeouts(data, fetchMonitorById);
    } catch (error) {
      if (error.response?.status === 401) {
        return navigate('/login');
      }
      if (error.response?.status === 403) {
        return navigate('/verify');
      }
      navigate('/error');
    }
  };

  useEffect(() => {
    fetchMontiors();
  }, []);

  return (
    <>
      {isOpen && (
        <Modal.Container glassmorph={glassmorph}>{content}</Modal.Container>
      )}
      {children}
    </>
  );
};

MonitorsLayout.displayName = 'MonitorsLayout';

export default observer(MonitorsLayout);
