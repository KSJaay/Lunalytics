// import dependencies
import PropTypes from 'prop-types';

// import local files
import {
  FaCircleCheck,
  FaClock,
  IoWarning,
  RiIndeterminateCircleFill,
} from '../../../../../icons';

const statusAndText = {
  Icon: {
    Operational: <FaCircleCheck />,
    Maintenance: <FaClock />,
    Incident: <IoWarning />,
    Outage: <RiIndeterminateCircleFill />,
  },
  Text: {
    Operational: 'Operational',
    Maintenance: 'Maintenance',
    Incident: 'Incident',
    Outage: 'Outage',
  },
};

const StatusUptimeNerdyGraph = ({ monitor = {}, indicator }) => {
  const iconOrText =
    statusAndText[indicator][monitor.status] ||
    statusAndText[indicator].Operational;

  return (
    <div className="status-uptime-nerdy-graph-content">
      <div className="status-uptime-nerdy-graph-header">
        <div className="status-uptime-nerdy-graph-title">
          {monitor.name || 'Monitor'}
        </div>
        <div className={`status-uptime-nerdy-graph-subtitle ${monitor.status}`}>
          {iconOrText}
        </div>
      </div>
      <div
        className={`status-uptime-nerdy-graph-pills-container ${monitor.status}`}
      >
        {Array.from({ length: 90 }).map((_, i) => (
          <div key={i}></div>
        ))}
      </div>
      <div className="status-uptime-nerdy-graph-footer">
        <div>90 days ago</div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--accent-600)',
            height: '2px',
          }}
        ></div>
        <div>100% uptime</div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--accent-600)',
            height: '2px',
          }}
        ></div>
        <div>Today</div>
      </div>
    </div>
  );
};

StatusUptimeNerdyGraph.displayName = 'StatusUptimeNerdyGraph';

StatusUptimeNerdyGraph.propTypes = {
  monitor: PropTypes.object.isRequired,
  indicator: PropTypes.string.isRequired,
};

export default StatusUptimeNerdyGraph;
