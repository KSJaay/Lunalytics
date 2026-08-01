// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate, Outlet } from 'react-router-dom';

// import local files
import {
  LocalStorageStateProvider,
  useLocalStorageState,
} from '../hooks/useLocalstorage';
import Loading from '../components/ui/loading';
import useSequentialFetch from '../hooks/useSequentialFetch';
import useMemberContext from '../context/member';
import useConfigContext from '../context/config';
import useUserContext from '../context/user';
import useModalContext from '../context/modal';

const GlobalLayout = () => {
  const { isOpen, content, isSettingsOpen, settings } = useModalContext();

  const { setUser } = useUserContext();

  const { setMember } = useMemberContext();

  const { setVersion } = useConfigContext();

  const navigate = useNavigate();

  const localStorageState = useLocalStorageState();

  const { isLoading } = useSequentialFetch({
    requests: [
      {
        url: '/api/auth/setup/exists',
        onSuccess: (data) => {
          if (data.setupRequired) navigate('/setup');
        },
      },
      {
        url: '/api/user',
        onSuccess: (data) => setUser(data),
      },
      {
        url: '/api/workspace/members/@me',
        onSuccess: (data) => setMember(data),
        onFailure: (error) => {
          if (error.response?.status === 401) {
            navigate('/workspace/select');
            return true;
          }
          return false;
        },
      },
      {
        url: '/api/version',
        onSuccess: (data) => setVersion({ ...data, hasLoaded: true }),
        onFailure: () => true,
      },
    ],
    onFailure: (error) => {
      if (error.response?.status === 401) return navigate('/login');
      if (error.response?.status === 403) return navigate('/verify');
      navigate('/error');
    },
  });

  if (isLoading) {
    return <Loading activeUrl="/home" />;
  }

  return (
    <LocalStorageStateProvider value={localStorageState}>
      {isOpen ? content : null}
      {isSettingsOpen ? settings : null}
      <Outlet />
    </LocalStorageStateProvider>
  );
};

GlobalLayout.displayName = 'GlobalLayout';

export default observer(GlobalLayout);
