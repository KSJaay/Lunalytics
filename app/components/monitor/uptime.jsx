import './uptime.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import { heartbeatPropType } from '../../../shared/utils/propTypes';
import UptimeInfo from './updateInfo';

const MonitorUptime = ({ heartbeats = [] }) => {
  const heartbeatList = heartbeats.map((heartbeat) => (
    <UptimeInfo key={heartbeat.id} heartbeat={heartbeat} />
  ));

  return (
    <div className="monitor-uptime-container">
      <div className="monitor-uptime-header-container">
        <div className="monitor-uptime-header">Status</div>
        <div className="monitor-uptime-header">Time</div>
        <div className="monitor-uptime-header">Message</div>
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
