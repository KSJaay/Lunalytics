import './status.scss';

const MonitorStatus = ({ monitor }) => {
  const [lastHeartbeat] = monitor.heartbeats;

  const averageResponseTime =
    monitor.heartbeats.reduce((acc, curr) => acc + curr.latency, 0) /
    monitor.heartbeats.length;

  return (
    <div className="monitor-status-container">
      <div className="monitor-status-content">
        <div className="monitor-status-title">Response</div>
        <div className="monitor-status-subtitle">(Currrent)</div>
        <div className="montior-status-text">{lastHeartbeat.latency}ms</div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Avg Response</div>
        <div className="monitor-status-subtitle">(24 Hours)</div>
        <div className="montior-status-text">
          {monitor.averageHeartbeatLatency}ms
        </div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Uptime</div>
        <div className="monitor-status-subtitle">(24 Hours)</div>
        <div className="montior-status-text">{monitor.uptimePercentage}%</div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Cert expiry</div>
        <div className="monitor-status-subtitle">(Days Left)</div>
        <div className="montior-status-text">46</div>
      </div>
    </div>
  );
};

export default MonitorStatus;
