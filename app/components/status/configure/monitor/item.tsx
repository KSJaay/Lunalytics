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

export default StatusConfigureMonitorItem;
