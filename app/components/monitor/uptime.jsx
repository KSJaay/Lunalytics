import './uptime.scss';
import moment from 'moment';
import 'moment-timezone';
import useTime from '../../hooks/useTime';
import classNames from 'classnames';

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

export default MonitorUptime;
