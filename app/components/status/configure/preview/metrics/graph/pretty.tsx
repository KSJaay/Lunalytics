// import local files
import StatusLayoutLineChart from '../../../layout/metrics/type/chart/line';

const StatusPageMetricsPrettyGraph = ({ title, showPing, heartbeats = [] }) => {
  if (!heartbeats.length) return null;

  const lastHeartbeat = heartbeats[heartbeats.length - 1];
  const ms = lastHeartbeat.latency;

  return (
    <div className="spmb-graph">
      <div className="spmb-header">
        <div className="spmb-title">{title}</div>
      </div>
      <div className="spmp-container">
        {showPing ? (
          <div className="spmp-content">
            <div className="spmp-item">
              <div className="spmp-title">Response Time</div>
              <div className="spmp-subtitle">{ms.toLocaleString()} ms</div>
            </div>

            <div className="spmp-item">
              <div className="spmp-title">Last Check</div>
              <div className="spmp-subtitle">{ms.toLocaleString()} ms</div>
            </div>
          </div>
        ) : null}

        <div className="spm-graph">
          <StatusLayoutLineChart heartbeats={heartbeats} />
        </div>
      </div>
    </div>
  );
};

StatusPageMetricsPrettyGraph.displayName = 'StatusPageMetricsPrettyGraph';

export default StatusPageMetricsPrettyGraph;
