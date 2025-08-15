// import dependencies
import { useMemo } from 'react';
import { ContextMenu } from '@lunalytics/ui';
import useContextStore from '../../context';
import useMonitorOptions from '../../hooks/useMonitorOptions';

interface ItemContainerProps {
  text: string;
  icon: React.ComponentType<{ size: number }>;
}

const ItemContainer = ({ text, icon: Icon, ...props }: ItemContainerProps) => {
  return (
    <div className="content-menu-item" {...props}>
      <Icon size={16} />
      <div>{text}</div>
    </div>
  );
};

export interface HomeMonitorsListContextProps {
  children: React.ReactNode;
  monitorId: string;
}

const HomeMonitorsListContext = ({
  children,
  monitorId,
}: HomeMonitorsListContextProps) => {
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
