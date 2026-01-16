// import dependencies
import { observer } from 'mobx-react-lite';
import { useNavigate, Outlet } from 'react-router-dom';

// import local files
import useContextStore from '../context';
import {
  LocalStorageStateProvider,
  useLocalStorageState,
} from '../hooks/useLocalstorage';
import Loading from '../components/ui/loading';
import useFetch from '../hooks/useFetch';
import useMemberContext from '../context/member';
import useConfigContext from '../context/config';

const GlobalLayout = () => {
  const {
    modalStore: { isOpen, content },
    userStore: { setUser },
  } = useContextStore();

  const { setMember } = useMemberContext();

  const { setVersion } = useConfigContext();

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

  const { isLoading: isMemberLoading } = useFetch({
    url: '/api/workspace/members/@me',
    onSuccess: (data) => {
      setMember(data);
    },
    onFailure: (error) => {
      if (error.response?.status === 401) {
        return navigate('/workspace/select');
      }

      navigate('/error');
    },
  });

  const { isLoading: isVersionLoading } = useFetch({
    url: '/api/version',
    onSuccess: (data) => {
      setVersion({ ...data, hasLoaded: true });
    },
  });

  if (isUserLoading || isSetupLoading || isMemberLoading || isVersionLoading) {
    return <Loading activeUrl="/home" />;
  }

  return (
    <LocalStorageStateProvider value={localStorageState}>
      {isOpen ? content : null}
      <Outlet />
    </LocalStorageStateProvider>
  );
};

GlobalLayout.displayName = 'GlobalLayout';

export default observer(GlobalLayout);
