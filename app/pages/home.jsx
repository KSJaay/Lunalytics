// import styles
import './home.scss';

// import dependencies
import { useState } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import {
  MonitorCard,
  MonitorList,
  MonitorCompact,
} from '../components/home/monitor';
import useContextStore from '../context';
import HomeMenu from '../components/home/menu';
import MonitorTable from '../components/home/monitor/layout/table';
import useLocalStorageContext from '../hooks/useLocalstorage';
import MonitorCompactItem from '../components/home/monitor/layout/compact/monitor';

const Home = () => {
  const {
    globalStore: { allMonitors },
  } = useContextStore();

  const [search, setSearch] = useState('');
  const { layout, status, setStatus } = useLocalStorageContext();
  const [activeMonitor, setActiveMonitor] = useState('');

  const handleReset = () => {
    setSearch('');
    setStatus('all');
  };

  const monitorsList = allMonitors
    .filter((monitor = {}) => {
      const matchesSearch =
        monitor.name?.toLowerCase().includes(search.toLowerCase()) ||
        monitor.url?.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      if (status === 'all') {
        return true;
      }

      const [lastHeartbeat = {}] = monitor.heartbeats;
      if (status === 'down') {
        return lastHeartbeat.isDown;
      }

      if (status === 'up') {
        return !lastHeartbeat.isDown;
      }

      return true;
    })
    .map((monitor, index) => {
      if (layout === 'list') {
        return (
          <MonitorList key={monitor.monitorId + index} monitor={monitor} />
        );
      }

      if (layout === 'compact') {
        return (
          <MonitorCompactItem
            key={monitor.monitorId + index}
            monitor={monitor}
            isActive={activeMonitor === monitor.monitorId}
            setActive={setActiveMonitor}
          />
        );
      }

      return <MonitorCard key={monitor.monitorId + index} monitor={monitor} />;
    });

  if (layout === 'cards') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <HomeMenu
          search={search}
          handleReset={handleReset}
          setSearch={(e) => setSearch(e.target.value)}
        />

        <div className="home-container">{monitorsList}</div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <HomeMenu
          search={search}
          handleReset={handleReset}
          setSearch={(e) => setSearch(e.target.value)}
        />

        <MonitorCompact monitor_id={activeMonitor}>
          {monitorsList}
        </MonitorCompact>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <HomeMenu
        search={search}
        handleReset={handleReset}
        setSearch={(e) => setSearch(e.target.value)}
      />

      <MonitorTable>{monitorsList}</MonitorTable>
    </div>
  );
};

Home.displayName = 'Home';

export default observer(Home);
