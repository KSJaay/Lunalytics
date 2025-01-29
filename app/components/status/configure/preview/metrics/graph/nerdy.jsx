// import dependencies
import PropTypes from 'prop-types';

// import local files
import StatusLayoutLineChart from '../../../layout/metrics/type/chart/line';

const StatusPageMetricsNerdyGraph = ({ title, showPing, heartbeats = [] }) => {
  if (!heartbeats.length) return null;

  const lastHeartbeat = heartbeats[heartbeats.length - 1];
  const ms = lastHeartbeat.latency;

  return (
    <div className="spmb-graph">
      <div className="spmb-header">
        <div className="spmb-title">{title}</div>
      </div>
      <div className="spmn-container">
        {showPing ? (
          <div className="spmn-content">
            <div className="spmn-item">
              <div className="spmn-title">Uptime</div>
              <div className="spmn-subtitle">99.99%</div>
            </div>
            <div className="spmn-item">
              <div className="spmn-title">Response Time</div>
              <div className="spmn-subtitle">{ms.toLocaleString()} ms</div>
            </div>
            <div className="spmn-item">
              <div className="spmn-title">Outages</div>
              <div className="spmn-subtitle">4 outages</div>
            </div>
            <div className="spmn-item">
              <div className="spmn-title">Last Check</div>
              <div className="spmn-subtitle">32 secs ago</div>
            </div>
          </div>
        ) : null}

        <div className="status-page-metrics-graph">
          <StatusLayoutLineChart heartbeats={heartbeats} />
        </div>
      </div>
    </div>
  );
};

StatusPageMetricsNerdyGraph.displayName = 'StatusPageMetricsNerdyGraph';

StatusPageMetricsNerdyGraph.propTypes = {
  title: PropTypes.string.isRequired,
  showPing: PropTypes.bool.isRequired,
  heartbeats: PropTypes.array.isRequired,
};

export default StatusPageMetricsNerdyGraph;
