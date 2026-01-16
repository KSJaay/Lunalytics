// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import useContextStore from '../context';
import Loading from '../components/ui/loading';

const NotificationRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    const {
      userStore: { getUserRoleRoute },
      notificationStore: { setNotifications, hasLoadedNotifications },
    } = useContextStore();
    const navigate = useNavigate();

    const onFailure = (error: any) => {
      if (error.response?.status === 403) {
        return navigate('/verify');
      }

      if (error.response?.status === 401) {
        const roleRoute = getUserRoleRoute();

        if (roleRoute && roleRoute !== '/notifications') {
          return navigate(roleRoute);
        }

        return navigate('/workspace/select');
      }
    };

    const { isLoading } = useFetch({
      hasFetched: hasLoadedNotifications,
      url: '/api/workspace/notifications',
      onSuccess: (data) => setNotifications(data),
      onFailure,
    });

    if (isLoading) {
      return <Loading asContainer activeUrl="/notifications" />;
    }

    return children;
  }
);

NotificationRoute.displayName = 'NotificationRoute';

export default NotificationRoute;
