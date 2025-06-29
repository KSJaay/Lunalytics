// import dependencies
import PropTypes from 'prop-types';

// import local files
import StatusLayoutLineChart from '../../../layout/metrics/type/chart/line';

const StatusPageMetricsBasicGraph = ({ title, showPing, heartbeats = [] }) => {
  if (heartbeats.length === 0)
    return (
      <div className="spmb-graph">
        <div className="spmb-header">
          <div className="spmb-title">{title}</div>
        </div>
        <div className="spm-graph">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'var(--font-lg)',
              color: 'var(--font-light-color)',
            }}
          >
            No heartbeats available
          </div>
        </div>
      </div>
    );

  const lastHeartbeat = heartbeats[heartbeats.length - 1];
  const ms = lastHeartbeat.latency;

  return (
    <div className="spmb-graph">
      <div className="spmb-header">
        <div className="spmb-title">{title}</div>
        {showPing && (
          <div className="spmb-subtitle">{ms.toLocaleString()} ms</div>
        )}
      </div>
      <div className="spm-graph">
        <StatusLayoutLineChart heartbeats={heartbeats} />
      </div>
    </div>
  );
};

StatusPageMetricsBasicGraph.displayName = 'StatusPageMetricsBasicGraph';

StatusPageMetricsBasicGraph.propTypes = {
  title: PropTypes.string.isRequired,
  showPing: PropTypes.bool.isRequired,
  heartbeats: PropTypes.array.isRequired,
};

export default StatusPageMetricsBasicGraph;
