// import dependencies
import { FaTriangleExclamation } from 'react-icons/fa6';

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
    Degraded: <FaTriangleExclamation />,
    Outage: <RiIndeterminateCircleFill />,
  },
  Text: {
    Operational: 'Operational',
    Maintenance: 'Maintenance',
    Incident: 'Incident',
    Degraded: 'Degraded Service',
    Outage: 'Outage',
  },
};

const StatusUptimePrettyGraph = ({
  monitor = {},
  indicator,
  // incidents = {},
}) => {
  const iconOrText =
    statusAndText[indicator][monitor.status] ||
    statusAndText[indicator].Operational;

  return (
    <div className="supg-content">
      <div className="supg-header">
        <div className="supg-title">{monitor.name || 'Monitor'}</div>
        <div className={`supg-subtitle ${monitor.status}`}>{iconOrText}</div>
      </div>
      <div className={`supg-pills-container ${monitor.status}`}>
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
      <div className="supg-footer">
        <div>90 days ago</div>
        <div>Today</div>
      </div>
    </div>
  );
};

StatusUptimePrettyGraph.displayName = 'StatusUptimePrettyGraph';

export default StatusUptimePrettyGraph;
