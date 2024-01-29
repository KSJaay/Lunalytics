import { heartbeatPropType } from '../../utils/propTypes';
import './statusBar.scss';

// import dependencies
import PropTypes from 'prop-types';

const StatusBar = ({ heartbeats = {}, maxHeartbeats = 12 }) => {
  const heartbeatList = [];

  for (let i = 0; i < maxHeartbeats; i++) {
    const heartbeat = heartbeats[i];
    if (heartbeat) {
      heartbeatList.push(
        <div
          key={heartbeat.id}
          className={
            heartbeat.isDown
              ? 'status-bar status-bar-alert'
              : 'status-bar status-bar-healthy'
          }
          title={
            heartbeat.isDown
              ? 'Unknown'
              : `${new Date().toUTCString()} - ${heartbeat.latency} ms`
          }
        ></div>
      );
    } else {
      heartbeatList.push(
        <div key={i} className="status-bar status-bar-unknown"></div>
      );
    }
  }

  return (
    <div
      className="status-bar-container"
      style={{ gridTemplateColumns: `repeat(${maxHeartbeats}, 1fr)` }}
    >
      {heartbeatList}
    </div>
  );
};

StatusBar.displayName = 'StatusBar';

StatusBar.propTypes = {
  heartbeats: PropTypes.arrayOf(heartbeatPropType).isRequired,
  maxHeartbeats: PropTypes.number,
};

export default StatusBar;
