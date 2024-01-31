// import local files
import {
  MonitorCard,
  MonitorList,
  MonitorCompact,
} from '../components/home/monitor';

// import styles
import './home.scss';

// import dependencies
import { useState } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../context';
import HomeMenu from '../components/home/menu';
import MonitorTable from '../components/home/monitor/layout/table';
import useLocalStorageContext from '../hooks/useLocalstorage';

const Home = () => {
  const {
    globalStore: { getAllMonitors },
  } = useContextStore();

  const [search, setSearch] = useState('');
  const { layout, status, setStatus } = useLocalStorageContext();

  const handleReset = () => {
    setSearch('');
    setStatus('all');
  };

  const monitors = getAllMonitors();

  const monitorsList = monitors
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
          <MonitorCompact key={monitor.monitorId + index} monitor={monitor} />
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <HomeMenu
        search={search}
        handleReset={handleReset}
        setSearch={(e) => setSearch(e.target.value)}
      />

      <MonitorTable layout={layout}>{monitorsList}</MonitorTable>
    </div>
  );
};

Home.displayName = 'Home';

export default observer(Home);
