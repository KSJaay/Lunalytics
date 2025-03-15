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

const StatusUptimeBasicGraph = ({ monitor = {}, indicator }) => {
  const iconOrText =
    statusAndText[indicator][monitor.status] ||
    statusAndText[indicator].Operational;

  return (
    <div className="subg-content">
      <div className="subg-title">{monitor.name || 'Monitor'}</div>
      <div className={`subg-icon ${monitor.status}`}>{iconOrText}</div>
    </div>
  );
};

StatusUptimeBasicGraph.displayName = 'StatusUptimeBasicGraph';

StatusUptimeBasicGraph.propTypes = {
  monitor: PropTypes.object.isRequired,
  indicator: PropTypes.string.isRequired,
};

export default StatusUptimeBasicGraph;
