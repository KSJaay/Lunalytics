import {
  ConfigureStatusProvider,
  useConfigureStatusState,
} from '../../../hooks/useConfigureStatus';

const StatusConfigureProvider = ({ children, activeStatusPage }) => {
  const statusValues = useConfigureStatusState(
    activeStatusPage?.settings,
    activeStatusPage?.layout
  );

  return (
    <ConfigureStatusProvider value={statusValues}>
      {children}
    </ConfigureStatusProvider>
  );
};

export default StatusConfigureProvider;
