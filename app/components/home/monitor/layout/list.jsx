import './list.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';

// import local files
import StatusBar from '../../../ui/statusBar';
import { monitorPropType } from '../../../../utils/propTypes';

const MonitorList = ({ monitor = {} }) => {
  const navigate = useNavigate();

  const { name, url, uptimePercentage = '0', heartbeats = [] } = monitor;
  const [heartbeat = {}] = heartbeats;
  const address = monitor.type === 'tcp' ? `${url}:${monitor.port}` : url;

  return (
    <div
      className="home-monitor-container-list"
      onClick={() => navigate(`/monitor/${monitor.monitorId}`)}
    >
      <div className="home-monitor-type-list">
        <div className="home-monitor-name-list">{name}</div>

        <a className="home-monitor-url">{address}</a>
      </div>

      <div className="home-monitor-uptime-ping">
        {heartbeat.latency ? `${heartbeat.latency} ms` : '0ms'}
      </div>

      <div className="home-monitor-uptime-list">{uptimePercentage}%</div>

      <div className="home-monitor-list-heartbeats">
        <StatusBar heartbeats={heartbeats} />
      </div>
    </div>
  );
};

MonitorList.displayName = 'MonitorList';

MonitorList.propTypes = {
  monitor: monitorPropType.isRequired,
};

export default MonitorList;
