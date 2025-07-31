// import styles
import '../styles/pages/home.scss';

// import dependencies
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FaEllipsisVertical } from 'react-icons/fa6';

// import local files
import useContextStore from '../context';
import Spacer from '../components/ui/spacer';
import Navigation from '../components/navigation';
import MonitorGraph from '../components/monitor/graph';
import { filterData } from '../../shared/utils/search';
import MonitorUptime from '../components/monitor/uptime';
import MonitorStatus from '../components/monitor/status';
import HomeMonitorHeader from '../components/home/header';
import HomeMonitorsList from '../components/home/monitors';
import MonitorConfigureModal from '../components/modal/monitor/configure';
import NavigationMonitorInfo from '../components/navigation/info/monitor';

const Home = () => {
  const {
    globalStore: { allMonitors, addMonitor, activeMonitor, setActiveMonitor },
    modalStore: { openModal, closeModal },
  } = useContextStore();
  const [search, setSearch] = useState(null);
  const { t } = useTranslation();

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
            {t('home.monitor.add')}
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
          <div>{t('home.monitor.none_exist')}</div>
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
