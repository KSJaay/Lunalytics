// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import Loading from '../components/ui/loading';
import { fetchMonitorById } from '../services/monitor/fetch';
import useUserContext from '../context/user';
import useGlobalContext from '../context/global';

const MonitorRoute = observer(({ children }: { children: React.ReactNode }) => {
  const { setMonitors, setTimeouts, hasLoadedMonitors } = useGlobalContext();
  const { getUserRoleRoute } = useUserContext();
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
