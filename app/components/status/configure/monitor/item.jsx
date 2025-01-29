// import dependencies
import PropTypes from 'prop-types';

// import local files
import { FaTrashCan } from '../../../icons';

const StatusConfigureMonitorItem = ({ monitor, removeMonitor }) => {
  if (!monitor) return null;

  return (
    <div className="status-configure-monitor-item-container">
      <div className="status-configure-monitor-item-header">
        <div className="status-configure-monitor-item-name">{monitor.name}</div>
        <div className="status-configure-monitor-item-url">{monitor.url}</div>
      </div>
      <div
        className="status-configure-monitor-item-icon"
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
