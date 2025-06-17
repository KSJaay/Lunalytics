// import dependencies
import dayjs from 'dayjs';
import classNames from 'classnames';
import { Tooltip } from '@lunalytics/ui';

// import local files
import { heartbeatPropType } from '../../../shared/utils/propTypes';
import useLocalStorageContext from '../../hooks/useLocalstorage';

const UptimeInfo = ({ heartbeat = {}, highestLatency = 0 }) => {
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

      <Tooltip text={`Latency: ${heartbeat.latency} ms`} color="gray">
        <div className="monitor-uptime-info-bar-container">
          <div className="monitor-uptime-info-bar-content">
            <div
              style={{
                width: `${Math.floor(
                  (100 / highestLatency) * heartbeat.latency
                )}%`,
              }}
              className="monitor-uptime-info-bar"
            />
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

UptimeInfo.displayName = 'UptimeInfo';

UptimeInfo.propTypes = {
  heartbeat: heartbeatPropType.isRequired,
};

export default UptimeInfo;
