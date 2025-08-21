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
import useScreenSize from '../hooks/useScreenSize';

const Home = () => {
  const {
    globalStore: { allMonitors, addMonitor, activeMonitor, setActiveMonitor },
    modalStore: { openModal, closeModal },
  } = useContextStore();
  const [search, setSearch] = useState<string | null>(null);
  const { t } = useTranslation();
  const screenSize = useScreenSize();
  const isDesktop = useMemo(() => screenSize === 'desktop', [screenSize]);

  useEffect(() => {
    if (!activeMonitor && isDesktop) {
      setActiveMonitor(allMonitors[0]?.monitorId);
    }
  }, [allMonitors, isDesktop]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const monitors = useMemo(() => {
    if (!search) return allMonitors;

    return filterData(allMonitors, search, ['name', 'url']);
  }, [search, JSON.stringify(allMonitors)]);

  if (!isDesktop && activeMonitor) {
    return (
      <div className="monitor-mobile-container">
        <HomeMonitorHeader isMobile={!isDesktop} />
        <MonitorStatus monitor={activeMonitor} />
        <MonitorGraph monitor={activeMonitor} />
        <MonitorUptime />
        <Spacer size={18} />
      </div>
    );
  }

  const content = isDesktop ? (
    <div className="monitor-container">
      <MonitorStatus monitor={activeMonitor} />
      <MonitorGraph monitor={activeMonitor} />
      <MonitorUptime />
      <Spacer size={18} />
    </div>
  ) : null;

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
                />
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
      rightChildren={
        isDesktop ? <NavigationMonitorInfo monitor={activeMonitor} /> : null
      }
      header={{ HeaderComponent: HomeMonitorHeader }}
    >
      {!activeMonitor ? (
        <div className="monitor-none-exist">
          <div>{t('home.monitor.none_exist')}</div>
        </div>
      ) : (
        content
      )}
    </Navigation>
  );
};

Home.displayName = 'Home';

export default observer(Home);
