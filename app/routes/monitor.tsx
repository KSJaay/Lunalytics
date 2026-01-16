// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import useContextStore from '../context';
import Loading from '../components/ui/loading';
import { fetchMonitorById } from '../services/monitor/fetch';

const MonitorRoute = observer(({ children }: { children: React.ReactNode }) => {
  const {
    userStore: { getUserRoleRoute },
    globalStore: { setMonitors, setTimeouts, hasLoadedMonitors },
    incidentStore: { setIncidents, hasLoadedIncidents },
  } = useContextStore();
  const navigate = useNavigate();

  const onFailure = (error: any) => {
    if (error.response?.status === 403) {
      return navigate('/verify');
    }

    if (error.response?.status === 401) {
      const roleRoute = getUserRoleRoute();

      if (roleRoute && roleRoute !== '/monitors') {
        return navigate(roleRoute);
      }

      return navigate('/workspace/select');
    }
  };

  const { isLoading } = useFetch({
    hasFetched: hasLoadedMonitors,
    url: '/api/workspace/monitors',
    onSuccess: (data) => {
      setMonitors(data);
      setTimeouts(data, fetchMonitorById);
    },
    onFailure,
  });

  if (isLoading) {
    return <Loading asContainer activeUrl="/home" />;
  }

  return children;
});

MonitorRoute.displayName = 'MonitorRoute';

export default MonitorRoute;
