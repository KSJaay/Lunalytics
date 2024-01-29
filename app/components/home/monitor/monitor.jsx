// import local files
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../ui/statusBar';

// import styles
import './monitor.scss';
import MonitorOptions from './options';
import { monitorPropType } from '../../../utils/propTypes';

const Monitor = ({ monitor = {} }) => {
  const navigate = useNavigate();

  const { name, url, uptimePercentage = '0', heartbeats = [] } = monitor;
  const [heartbeat] = heartbeats;

  return (
    <div className="home-monitor-container">
      <div className="home-monitor-type">
        <div>{name}</div>
        <span>
          <MonitorOptions monitorId={monitor.monitorId} />
        </span>
      </div>
      <span onClick={() => navigate(`/monitor/${monitor.monitorId}`)}>
        <a className="home-monitor-url">{url}</a>
        <div className="home-monitor-uptime-container">
          <div className="home-monitor-uptime">
            <h1>Ping</h1>
            <div>
              {heartbeat?.latency ? `${heartbeat?.latency} ms` : 'Unknown'}
            </div>
          </div>
          <div className="home-monitor-uptime">
            <h1>Uptime</h1>
            <div>{uptimePercentage}%</div>
          </div>
        </div>
        <div className="home-monitor-status">
          <h1>Status</h1>
          <StatusBar heartbeats={heartbeats} />
        </div>
      </span>
    </div>
  );
};

Monitor.displayName = 'Monitor';

Monitor.propTypes = {
  monitor: monitorPropType.isRequired,
};

export default Monitor;
