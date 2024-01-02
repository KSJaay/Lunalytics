import './status.scss';

const MonitorStatus = () => {
  return (
    <div className="monitor-status-container">
      <div className="monitor-status-content">
        <div className="monitor-status-title">Response</div>
        <div className="monitor-status-subtitle">(Currrent)</div>
        <div className="montior-status-text">12ms</div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Avg Response</div>
        <div className="monitor-status-subtitle">(24 Hours)</div>
        <div className="montior-status-text">15ms</div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Uptime</div>
        <div className="monitor-status-subtitle">(24 Hours)</div>
        <div className="montior-status-text">10 years</div>
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
