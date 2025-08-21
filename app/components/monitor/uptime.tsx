import './uptime.scss';

// import dependencies
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// import local files
import UptimeInfo from './updateInfo';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';

const MonitorUptime = () => {
  const { t } = useTranslation();

  const {
    globalStore: { activeMonitor },
  } = useContextStore();

  const heartbeatList = useMemo(() => {
    const highestLatency = activeMonitor?.heartbeats?.reduce((acc, curr) => {
      return Math.max(acc, curr.latency);
    }, 0);

    const heartbeatList = activeMonitor?.heartbeats?.map((heartbeat) => (
      <UptimeInfo
        key={heartbeat.id}
        heartbeat={heartbeat}
        highestLatency={highestLatency}
      />
    ));

    return heartbeatList;
  }, [JSON.stringify(activeMonitor)]);

  return (
    <div className="monitor-uptime-container">
      <div className="monitor-uptime-header-container">
        <div className="monitor-uptime-header">
          {t('home.monitor.table.status')}
        </div>
        <div className="monitor-uptime-header">
          {t('home.monitor.table.time')}
        </div>
        <div className="monitor-uptime-header">
          {t('home.monitor.table.message')}
        </div>
        <div className="monitor-uptime-header">
          {t('home.monitor.headers.latency')}
        </div>
      </div>
      {heartbeatList}
    </div>
  );
};

MonitorUptime.displayName = 'MonitorUptime';

export default observer(MonitorUptime);
