// import dependencies
import dayjs from 'dayjs';
import relativeDayjs from 'dayjs/plugin/relativeTime';

// import local files
import StatusLayoutLineChart from '../../../layout/metrics/type/chart/line';

dayjs.extend(relativeDayjs);

const StatusPageMetricsNerdyGraph = ({
  title,
  showPing,
  heartbeats = [],
  incidentCount = 0,
}) => {
  if (!heartbeats.length) return null;

  const lastHeartbeat = heartbeats[0];
  const ms = lastHeartbeat.latency;

  const uptimePercentage =
    heartbeats.length === 0
      ? 100
      : ((heartbeats.length - incidentCount) / heartbeats.length) * 100;

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
              <div className="spmn-subtitle">
                {uptimePercentage.toFixed(2).replace(/\.00$/, '')}%
              </div>
            </div>
            <div className="spmn-item">
              <div className="spmn-title">Response Time</div>
              <div className="spmn-subtitle">{ms.toLocaleString()} ms</div>
            </div>
            <div className="spmn-item">
              <div className="spmn-title">Outages</div>
              <div className="spmn-subtitle">{incidentCount} outages</div>
            </div>
            <div className="spmn-item">
              <div className="spmn-title">Last Check</div>
              <div className="spmn-subtitle">
                {dayjs(lastHeartbeat.date).fromNow()}
              </div>
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

StatusPageMetricsNerdyGraph.displayName = 'StatusPageMetricsNerdyGraph';

export default StatusPageMetricsNerdyGraph;
