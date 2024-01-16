import './uptime.scss';

const UptimeInfo = ({ heartbeat }) => (
  <div className="monitor-uptime-content">
    <div
      className={
        heartbeat?.isDown
          ? 'monitor-uptime-info-button monitor-uptime-info-button-inactive'
          : 'monitor-uptime-info-button monitor-uptime-info-button-active'
      }
    >
      {heartbeat?.isDown ? 'DOWN' : 'UP'}
    </div>
    <div className="monitor-uptime-info">
      {new Date(heartbeat.date).toString()}
    </div>
    <div className="monitor-uptime-info">{heartbeat.message || 'Unknown'}</div>
  </div>
);

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
