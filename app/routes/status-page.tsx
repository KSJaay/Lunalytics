// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import useContextStore from '../context';
import Loading from '../components/ui/loading';

const StatusPageRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    const {
      userStore: { getUserRoleRoute },
      statusStore: { setStatusPages },
    } = useContextStore();
    const navigate = useNavigate();

    const onFailure = (error: any) => {
      if (error.response?.status === 403) {
        return navigate('/verify');
      }

      if (error.response?.status === 401) {
        const roleRoute = getUserRoleRoute();

        if (roleRoute && roleRoute !== '/status-pages') {
          return navigate(roleRoute);
        }

        return navigate('/workspace/select');
      }
    };

    const { isLoading } = useFetch({
      url: '/api/status-pages',
      onSuccess: (data) => setStatusPages(data),
      onFailure,
    });

    if (isLoading) {
      return <Loading />;
    }

    return children;
  }
);

StatusPageRoute.displayName = 'StatusPageRoute';

export default StatusPageRoute;
