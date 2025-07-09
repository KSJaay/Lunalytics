// import styles
import '../../styles/pages/home.scss';

// import dependencies
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

// import local files
import Monitor from '../monitor';
import useContextStore from '../../context';
import Navigation from '../../components/navigation';
import HomeMonitorHeader from '../../components/home/header';
import HomeMonitorsList from '../../components/home/monitors';
import NavigationMonitorInfo from '../../components/navigation/info/monitor';
import MonitorConfigureModal from '../../components/modal/monitor/configure';

const Home = () => {
  const {
    globalStore: { allMonitors, addMonitor },
    modalStore: { openModal, closeModal },
  } = useContextStore();

  const [selectedMonitor, setSelectedMonitor] = useState('');

  useEffect(() => {
    if (!selectedMonitor) setSelectedMonitor(allMonitors[0]?.monitorId);
  }, [allMonitors]);

  const activeMonitor = allMonitors.find(
    (monitor) => monitor.monitorId === selectedMonitor
  );

  return (
    <Navigation
      leftChildren={
        <HomeMonitorsList
          monitors={allMonitors}
          selectedMonitor={selectedMonitor}
          setSelectedMonitor={setSelectedMonitor}
        />
      }
      leftButton={
        <Button
          variant="flat"
          fullWidth
          onClick={() =>
            openModal(
              <MonitorConfigureModal
                monitor={activeMonitor}
                closeModal={closeModal}
                handleMonitorSubmit={addMonitor}
              />,
              false
            )
          }
        >
          Add Monitor
        </Button>
      }
      rightChildren={<NavigationMonitorInfo monitor={activeMonitor} />}
      header={{
        props: { monitor: activeMonitor },
        HeaderComponent: HomeMonitorHeader,
      }}
    >
      <Monitor monitor_id={selectedMonitor} />
    </Navigation>
  );
};

Home.displayName = 'Home';

export default observer(Home);
