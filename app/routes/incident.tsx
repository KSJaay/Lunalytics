// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import Loading from '../components/ui/loading';
import useUserContext from '../context/user';
import useIncidentContext from '../context/incidents';

const IncidentRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    const { setIncidents, hasLoadedIncidents } = useIncidentContext();
    const { getUserRoleRoute } = useUserContext();

    const navigate = useNavigate();

    const onFailure = (error: any) => {
      if (error.response?.status === 403) {
        return navigate('/verify');
      }

      if (error.response?.status === 401) {
        const roleRoute = getUserRoleRoute();

        if (roleRoute && roleRoute !== '/incidents') {
          return navigate(roleRoute);
        }

        return navigate('/workspace/select');
      }
    };

    const { isLoading } = useFetch({
      hasFetched: hasLoadedIncidents,
      url: '/api/workspace/incidents',
      onSuccess: (data) => {
        setIncidents(data);
      },
      onFailure,
    });

    if (isLoading) {
      return <Loading asContainer activeUrl="/incidents" />;
    }

    return children;
  }
);

IncidentRoute.displayName = 'IncidentRoute';

export default IncidentRoute;
