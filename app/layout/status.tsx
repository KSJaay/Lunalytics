// import dependencies
import PropTypes from 'prop-types';

// import local files
import {
  LocalStorageStateProvider,
  useLocalStorageState,
} from '../hooks/useLocalstorage';
import type { LayoutStatusProps } from '../types/layout';

const StatusLayout = ({ children }: LayoutStatusProps) => {
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
