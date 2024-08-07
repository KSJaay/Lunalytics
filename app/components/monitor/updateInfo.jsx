import './uptime.scss';

// import dependencies
import dayjs from 'dayjs';
import classNames from 'classnames';

// import local files
import { heartbeatPropType } from '../../../shared/utils/propTypes';
import useLocalStorageContext from '../../hooks/useLocalstorage';

const UptimeInfo = ({ heartbeat = {} }) => {
  const { dateformat, timeformat, timezone } = useLocalStorageContext();

  const classes = classNames('monitor-uptime-info-button', {
    'monitor-uptime-info-button-inactive': heartbeat?.isDown,
    'monitor-uptime-info-button-active': !heartbeat?.isDown,
  });

  return (
    <div className="monitor-uptime-content">
      <div className={classes}>{heartbeat?.isDown ? 'DOWN' : 'UP'}</div>
      <div className="monitor-uptime-info">
        {dayjs(
          new Date(heartbeat.date).toLocaleString('en-US', {
            timeZone: timezone,
          })
        ).format(`${dateformat} ${timeformat}`)}
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
