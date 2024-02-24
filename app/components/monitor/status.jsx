import './status.scss';

// import local files
import { fullMonitorPropType } from '../../utils/propTypes';

const MonitorStatus = ({ monitor = [] }) => {
  const [lastHeartbeat = {}] = monitor.heartbeats;

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
          {monitor.averageHeartbeatLatency || 0}ms
        </div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Uptime</div>
        <div className="monitor-status-subtitle">(24 Hours)</div>
        <div className="montior-status-text">
          {monitor.uptimePercentage || 0}%
        </div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Cert expiry</div>
        <div className="monitor-status-subtitle">(Days Left)</div>
        <div className="montior-status-text">
          {monitor.url?.startsWith('http://')
            ? 'Invalid'
            : monitor.cert?.isValid
            ? `${monitor.cert.daysRemaining}`
            : 'Expired'}
        </div>
      </div>
    </div>
  );
};

MonitorStatus.displayName = 'MonitorStatus';

MonitorStatus.propTypes = {
  monitor: fullMonitorPropType.isRequired,
};

export default MonitorStatus;
