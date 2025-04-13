import './uptime.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import { heartbeatPropType } from '../../../shared/utils/propTypes';
import UptimeInfo from './updateInfo';

const MonitorUptime = ({ heartbeats = [] }) => {
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

  return (
    <div className="monitor-uptime-container">
      <div className="monitor-uptime-header-container">
        <div className="monitor-uptime-header">Status</div>
        <div className="monitor-uptime-header">Time</div>
        <div className="monitor-uptime-header">Message</div>
        <div className="monitor-uptime-header">Latency</div>
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
