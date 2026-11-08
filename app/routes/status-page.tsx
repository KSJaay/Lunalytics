// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import Loading from '../components/ui/loading';
import useUserContext from '../context/user';
import useStatusContext from '../context/status';

const StatusPageRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    const { setStatusPages, hasLoadedStatusPages } = useStatusContext();
    const { getUserRoleRoute } = useUserContext();
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
      hasFetched: hasLoadedStatusPages,
      url: '/api/workspace/status-pages',
      onSuccess: (data) => setStatusPages(data),
      onFailure,
    });

    if (isLoading) {
      return <Loading asContainer activeUrl="/status-pages" />;
    }

    return children;
  }
);

StatusPageRoute.displayName = 'StatusPageRoute';

export default StatusPageRoute;
