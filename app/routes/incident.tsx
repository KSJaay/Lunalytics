// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import useContextStore from '../context';
import Loading from '../components/ui/loading';

const IncidentRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    const {
      userStore: { getUserRoleRoute },
      incidentStore: { setIncidents },
    } = useContextStore();
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
      url: '/api/incident/all',
      onSuccess: (data) => {
        setIncidents(data);
      },
      onFailure,
    });

    if (isLoading) {
      return <Loading />;
    }

    return children;
  }
);

IncidentRoute.displayName = 'IncidentRoute';

export default IncidentRoute;
