// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useContextStore from '../context';
import { fetchMonitorById } from '../services/monitor/fetch';
import {
  LocalStorageStateProvider,
  useLocalStorageState,
} from '../hooks/useLocalstorage';
import Loading from '../components/ui/loading';
import useFetch from '../hooks/useFetch';
import type { LayoutGlobalProps } from '../types/layout';

const GlobalLayout = ({ children }: LayoutGlobalProps) => {
  const {
    modalStore: { isOpen, content },
    globalStore: { setMonitors, setTimeouts },
    userStore: { setUser },
    notificationStore: { setNotifications },
    statusStore: { setStatusPages },
    incidentStore: { setIncidents },
  } = useContextStore();

  const navigate = useNavigate();

  const localStorageState = useLocalStorageState();

  const onFailure = (error: any) => {
    if (error.response?.status === 401) {
      return navigate('/login');
    }

    if (error.response?.status === 403) {
      return navigate('/verify');
    }

    navigate('/error');
  };

  const { isLoading: isSetupLoading } = useFetch({
    url: '/api/auth/setup/exists',
    onSuccess: (data) => {
      if (data.setupRequired) {
        navigate('/setup');
      }
    },
    onFailure,
  });

  const { isLoading: isUserLoading } = useFetch({
    url: '/api/user',
    onSuccess: (data) => setUser(data),
    onFailure,
  });

  const { isLoading: isMonitorsLoading } = useFetch({
    url: '/api/member/monitors',
    onSuccess: (data) => {
      setMonitors(data);
      setTimeouts(data, fetchMonitorById);
    },
    onFailure,
  });

  const { isLoading: isNotificationsLoading } = useFetch({
    url: '/api/notifications',
    onSuccess: (data) => setNotifications(data),
    onFailure,
  });

  const { isLoading: isStatusPagesLoading } = useFetch({
    url: '/api/status-pages',
    onSuccess: (data) => setStatusPages(data),
    onFailure,
  });

  const { isLoading: isIncidentsLoading } = useFetch({
    url: '/api/incident/all',
    onSuccess: (data) => setIncidents(data),
    onFailure,
  });

  if (
    isUserLoading ||
    isMonitorsLoading ||
    isNotificationsLoading ||
    isStatusPagesLoading ||
    isIncidentsLoading ||
    isSetupLoading
  ) {
    return <Loading />;
  }

  return (
    <LocalStorageStateProvider value={localStorageState}>
      {isOpen ? content : null}
      {children}
    </LocalStorageStateProvider>
  );
};

GlobalLayout.displayName = 'GlobalLayout';

export default observer(GlobalLayout);
