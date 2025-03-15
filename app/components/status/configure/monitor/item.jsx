// import dependencies
import PropTypes from 'prop-types';

// import local files
import { FaTrashCan } from '../../../icons';

const StatusConfigureMonitorItem = ({ monitor, removeMonitor }) => {
  if (!monitor) return null;

  return (
    <div className="scmi-container">
      <div className="scmi-header">
        <div className="scmi-name">{monitor.name}</div>
        <div className="scmi-url">{monitor.url}</div>
      </div>
      <div
        className="scmi-icon"
        onClick={() => removeMonitor(monitor.monitorId)}
      >
        <FaTrashCan />
      </div>
    </div>
  );
};

StatusConfigureMonitorItem.displayName = 'StatusConfigureMonitorItem';

StatusConfigureMonitorItem.propTypes = {
  monitor: PropTypes.object,
  removeMonitor: PropTypes.func,
};

export default StatusConfigureMonitorItem;
