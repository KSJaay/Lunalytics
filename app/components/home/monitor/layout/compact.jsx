import './compact.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';

// import local files
import { monitorPropType } from '../../../../../shared/utils/propTypes';

const MonitorList = ({ monitor = {} }) => {
  const navigate = useNavigate();

  const { name, uptimePercentage = '0', heartbeats = [] } = monitor;
  const [heartbeat = {}] = heartbeats;

  return (
    <div
      className="home-monitor-container-compact"
      onClick={() => navigate(`/monitor/${monitor.monitorId}`)}
      id={`monitor-${monitor.name}`}
    >
      <div className="home-monitor-name-compact">{name}</div>

      <div className="home-monitor-uptime-compact">
        {heartbeat.latency ? `${heartbeat.latency}ms` : '0ms'}
      </div>

      <div className="home-monitor-uptime-compact">{uptimePercentage}%</div>
    </div>
  );
};

MonitorList.displayName = 'MonitorList';

MonitorList.propTypes = {
  monitor: monitorPropType.isRequired,
};

export default MonitorList;
