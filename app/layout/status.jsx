// import dependencies
import PropTypes from 'prop-types';

// import local files
import {
  LocalStorageStateProvider,
  useLocalStorageState,
} from '../hooks/useLocalstorage';

const StatusLayout = ({ children }) => {
  const localStorageState = useLocalStorageState();

  return (
    <LocalStorageStateProvider value={localStorageState}>
      {children}
    </LocalStorageStateProvider>
  );
};

StatusLayout.displayName = 'StatusLayout';

StatusLayout.propTypes = {
  children: PropTypes.node,
};

export default StatusLayout;
