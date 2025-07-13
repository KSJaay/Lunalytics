// import styles
import '../styles/pages/home.scss';

// import dependencies
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

// import local files
import Monitor from './monitor';
import useContextStore from '../context';
import Navigation from '../components/navigation';
import HomeMonitorHeader from '../components/home/header';
import HomeMonitorsList from '../components/home/monitors';
import NavigationMonitorInfo from '../components/navigation/info/monitor';
import MonitorConfigureModal from '../components/modal/monitor/configure';

const Home = () => {
  const {
    globalStore: { allMonitors, addMonitor, activeMonitor, setActiveMonitor },
    modalStore: { openModal, closeModal },
  } = useContextStore();

  useEffect(() => {
    if (!activeMonitor) setActiveMonitor(allMonitors[0]?.monitorId);
  }, [allMonitors]);

  return (
    <Navigation
      leftChildren={<HomeMonitorsList monitors={allMonitors} />}
      leftButton={
        <Button
          variant="flat"
          fullWidth
          onClick={() =>
            openModal(
              <MonitorConfigureModal
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
      header={{ HeaderComponent: HomeMonitorHeader }}
    >
      {!activeMonitor ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            fontWeight: 'bold',
            fontSize: 'var(--font-2xl)',
            color: 'var(--font-light-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>No monitors found</div>
        </div>
      ) : (
        <Monitor />
      )}
    </Navigation>
  );
};

Home.displayName = 'Home';

export default observer(Home);
