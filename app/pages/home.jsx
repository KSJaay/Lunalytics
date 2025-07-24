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
import { filterData } from '../../shared/utils/search';

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

  const monitors = useMemo(() => {
    if (!search) return allMonitors;

    return filterData(allMonitors, search, ['name', 'url']);
  }, [search, JSON.stringify(allMonitors)]);

  return (
    <Navigation
      leftChildren={<HomeMonitorsList monitors={monitors} />}
      handleSearchUpdate={handleSearchUpdate}
      leftButton={
        <div className="monitor-left-button-container">
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
          <div className="monitor-left-menu">
            <FaEllipsisVertical size={20} />
          </div>
        </div>
      }
      rightChildren={<NavigationMonitorInfo monitor={activeMonitor} />}
      header={{ HeaderComponent: HomeMonitorHeader }}
    >
      {!activeMonitor ? (
        <div className="monitor-none-exist">
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
