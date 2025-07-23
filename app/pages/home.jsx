// import styles
import '../styles/pages/home.scss';

// import dependencies
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { FaEllipsisVertical } from 'react-icons/fa6';

// import local files
import useContextStore from '../context';
import Navigation from '../components/navigation';
import HomeMonitorHeader from '../components/home/header';
import HomeMonitorsList from '../components/home/monitors';
import NavigationMonitorInfo from '../components/navigation/info/monitor';
import MonitorConfigureModal from '../components/modal/monitor/configure';
import MonitorStatus from '../components/monitor/status';
import MonitorGraph from '../components/monitor/graph';
import MonitorUptime from '../components/monitor/uptime';
import Spacer from '../components/ui/spacer';

const Home = () => {
  const {
    globalStore: { allMonitors, addMonitor, activeMonitor, setActiveMonitor },
    modalStore: { openModal, closeModal },
  } = useContextStore();
  const [search, setSearch] = useState(null);

  useEffect(() => {
    if (!activeMonitor) setActiveMonitor(allMonitors[0]?.monitorId);
  }, [allMonitors]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const monitors = useMemo(
    () =>
      allMonitors.filter((monitor) => {
        if (search) {
          const lowercaseSearch = search?.toLowerCase() || '';
          return (
            monitor?.name?.toLowerCase()?.includes(lowercaseSearch) ||
            monitor?.url?.toLowerCase()?.includes(lowercaseSearch)
          );
        }
        return true;
      }),
    [search, JSON.stringify(allMonitors)]
  );

  return (
    <Navigation
      leftChildren={<HomeMonitorsList monitors={monitors} />}
      handleSearchUpdate={handleSearchUpdate}
      leftButton={
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: 'var(--accent-800)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            <FaEllipsisVertical size={20} />
          </div>
        </div>
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
        <div className="monitor-container">
          <MonitorStatus monitor={activeMonitor} />
          <MonitorGraph monitor={activeMonitor} />
          <MonitorUptime heartbeats={activeMonitor.heartbeats} />
          <Spacer size={18} />
        </div>
      )}
    </Navigation>
  );
};

Home.displayName = 'Home';

export default observer(Home);
