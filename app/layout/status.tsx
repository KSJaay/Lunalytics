// import type definitions
import type { LayoutStatusProps } from '../../shared/types/layout';

// import local files
import {
  LocalStorageStateProvider,
  useLocalStorageState,
} from '../hooks/useLocalstorage';

const StatusLayout = ({ children }: LayoutStatusProps) => {
  const localStorageState = useLocalStorageState();

  return (
    <LocalStorageStateProvider value={localStorageState}>
      {children}
    </LocalStorageStateProvider>
  );
};

StatusLayout.displayName = 'StatusLayout';

export default StatusLayout;
