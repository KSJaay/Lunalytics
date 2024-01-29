import './uptime.scss';

// import dependencies
import 'moment-timezone';
import moment from 'moment';
import classNames from 'classnames';

// import local files
import useTime from '../../hooks/useTime';
import { heartbeatPropType } from '../../utils/propTypes';

const UptimeInfo = ({ heartbeat }) => {
  const { dateformat, timeformat, timezone } = useTime();

  const classes = classNames('monitor-uptime-info-button', {
    'monitor-uptime-info-button-inactive': heartbeat?.isDown,
    'monitor-uptime-info-button-active': !heartbeat?.isDown,
  });

  return (
    <div className="monitor-uptime-content">
      <div className={classes}>{heartbeat?.isDown ? 'DOWN' : 'UP'}</div>
      <div className="monitor-uptime-info">
        {moment(heartbeat.date)
          .tz(timezone)
          .format(`${dateformat} ${timeformat}`)}
      </div>
      <div className="monitor-uptime-info">
        {heartbeat.message || 'Unknown'}
      </div>
    </div>
  );
};

UptimeInfo.displayName = 'UptimeInfo';

UptimeInfo.propTypes = {
  heartbeat: heartbeatPropType.isRequired,
};

export default UptimeInfo;
