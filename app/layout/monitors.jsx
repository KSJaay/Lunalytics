// import dependencies
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import Modal from '../components/ui/modal';
import useContextStore from '../context';
import { createGetRequest } from '../services/axios';
import { fetchMonitorById } from '../services/monitor/fetch';

const MonitorsLayout = ({ children }) => {
  const {
    modalStore: { isOpen, content, glassmorph },
    globalStore: { setMonitors, setTimeouts },
    userStore: { setUser },
  } = useContextStore();

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

MonitorsLayout.propTypes = {
  children: PropTypes.node,
};

export default observer(MonitorsLayout);
