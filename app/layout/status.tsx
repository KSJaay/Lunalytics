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

export default StatusLayout;
