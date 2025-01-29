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

const StatusUptimePrettyGraph = ({ monitor = {}, indicator }) => {
  const iconOrText =
    statusAndText[indicator][monitor.status] ||
    statusAndText[indicator].Operational;

  return (
    <div className="status-uptime-pretty-graph-content">
      <div className="status-uptime-pretty-graph-header">
        <div className="status-uptime-pretty-graph-title">
          {monitor.name || 'Monitor'}
        </div>
        <div
          className={`status-uptime-pretty-graph-subtitle ${monitor.status}`}
        >
          {iconOrText}
        </div>
      </div>
      <div
        className={`status-uptime-pretty-graph-pills-container ${monitor.status}`}
      >
        {Array.from({ length: 90 }).map((_, i) => (
          <div key={i}></div>
        ))}
      </div>
      <div className="status-uptime-pretty-graph-footer">
        <div>90 days ago</div>
        <div>Today</div>
      </div>
    </div>
  );
};

StatusUptimePrettyGraph.displayName = 'StatusUptimePrettyGraph';

StatusUptimePrettyGraph.propTypes = {
  monitor: PropTypes.object.isRequired,
  indicator: PropTypes.string.isRequired,
};

export default StatusUptimePrettyGraph;
