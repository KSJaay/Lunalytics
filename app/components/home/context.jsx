// import dependencies
import { useMemo } from 'react';
import { ContextMenu } from '@lunalytics/ui';
import useContextStore from '../../context';
import useMonitorOptions from '../../hooks/useMonitorOptions';

const styles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const ItemContainer = ({ text, icon: Icon, ...props }) => {
  return (
    <div style={styles} {...props}>
      <Icon size={16} />
      <div>{text}</div>
    </div>
  );
};

const HomeMonitorsListContext = ({ children, monitorId }) => {
  const {
    globalStore: {
      allMonitors,
      getMonitor,
      addMonitor,
      editMonitor,
      removeMonitor,
    },
    modalStore: { closeModal, openModal },
  } = useContextStore();

  const monitor = useMemo(() => {
    return getMonitor(monitorId);
  }, [monitorId, allMonitors]);

  const { options } = useMonitorOptions(
    ItemContainer,
    monitor,
    addMonitor,
    editMonitor,
    removeMonitor,
    closeModal,
    openModal
  );

  return (
    <ContextMenu
      position="bottom"
      key={monitorId}
      items={options}
      align="start"
    >
      {children}
    </ContextMenu>
  );
};

export default HomeMonitorsListContext;
