// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import Modal from '../components/ui/modal';
import useContextStore from '../context';
import { fetchMonitorById } from '../services/monitor/fetch';
import {
  LocalStorageStateProvider,
  useLocalStorageState,
} from '../hooks/useLocalstorage';
import Loading from '../components/ui/loading';
import useFetch from '../hooks/useFetch';

const GlobalLayout = ({ children }) => {
  const {
    modalStore: { isOpen, content, glassmorph },
    globalStore: { setMonitors, setTimeouts },
    userStore: { setUser },
    notificationStore: { setNotifications },
    statusStore: { setStatusPages },
    incidentStore: { setIncidents },
  } = useContextStore();

  const navigate = useNavigate();

  const localStorageState = useLocalStorageState();

  const { isLoading: isUserLoading } = useFetch({
    url: '/api/user',
    onSuccess: (data) => setUser(data),
    onFailure: (error) => {
      if (error.response?.status === 401) {
        return navigate('/login');
      }

      if (error.response?.status === 403) {
        return navigate('/verify');
      }

      navigate('/error');
    },
  });

  const { isLoading: isMonitorsLoading } = useFetch({
    url: '/api/user/monitors',
    onSuccess: (data) => {
      setMonitors(data);
      setTimeouts(data, fetchMonitorById);
    },
    onFailure: () => navigate('/error'),
  });

  const { isLoading: isNotificationsLoading } = useFetch({
    url: '/api/notifications',
    onSuccess: (data) => setNotifications(data),
    onFailure: () => navigate('/error'),
  });

  const { isLoading: isStatusPagesLoading } = useFetch({
    url: '/api/status-pages',
    onSuccess: (data) => setStatusPages(data),
    onFailure: () => navigate('/error'),
  });

  const { isLoading: isIncidentsLoading } = useFetch({
    url: '/api/incident/all',
    onSuccess: (data) => setIncidents(data),
    onFailure: () => navigate('/error'),
  });

  if (
    isUserLoading ||
    isMonitorsLoading ||
    isNotificationsLoading ||
    isStatusPagesLoading ||
    isIncidentsLoading
  ) {
    return <Loading />;
  }

  return (
    <LocalStorageStateProvider value={localStorageState}>
      {isOpen && (
        <Modal.Container glassmorph={glassmorph}>{content}</Modal.Container>
      )}
      {children}
    </LocalStorageStateProvider>
  );
};

GlobalLayout.displayName = 'GlobalLayout';

GlobalLayout.propTypes = {
  children: PropTypes.node,
};

export default observer(GlobalLayout);
