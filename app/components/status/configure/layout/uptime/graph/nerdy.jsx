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

const StatusUptimeNerdyGraph = ({
  monitor = {},
  indicator,
  // incidents = {},
}) => {
  const iconOrText =
    statusAndText[indicator][monitor.status] ||
    statusAndText[indicator].Operational;

  return (
    <div className="sung-content">
      <div className="sung-header">
        <div className="sung-title">{monitor.name || 'Monitor'}</div>
        <div className={`sung-subtitle ${monitor.status}`}>{iconOrText}</div>
      </div>
      <div className={`sung-pills-container ${monitor.status}`}>
        {Array.from({ length: 90 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (90 - (i + 1)));
          // const dateString = date.toISOString().split('T')[0];

          const statusColor =
            date.getTime() < new Date(monitor.createdAt).getTime()
              ? 'gray'
              : 'Operational';

          return <div key={i} className={statusColor}></div>;
        })}
      </div>
      <div className="sung-footer">
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
