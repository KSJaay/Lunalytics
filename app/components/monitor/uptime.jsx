import './uptime.scss';

// import dependencies
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// import local files
import UptimeInfo from './updateInfo';
import { heartbeatPropType } from '../../../shared/utils/propTypes';

const MonitorUptime = ({ heartbeats = [] }) => {
  const { t } = useTranslation();

  const heartbeatList = useMemo(() => {
    const highestLatency = heartbeats.reduce((acc, curr) => {
      return Math.max(acc, curr.latency);
    }, 0);

    const heartbeatList = heartbeats.map((heartbeat) => (
      <UptimeInfo
        key={heartbeat.id}
        heartbeat={heartbeat}
        highestLatency={highestLatency}
      />
    ));

    return heartbeatList;
  }, [heartbeats]);

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

MonitorUptime.propTypes = {
  heartbeats: PropTypes.arrayOf(heartbeatPropType).isRequired,
};

export default MonitorUptime;
