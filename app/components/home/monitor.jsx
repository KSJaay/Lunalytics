// import local files
import { useNavigate } from 'react-router-dom';
import FaEllipsisVertical from '../icons/faEllipsisVertical';
import StatusBar from '../ui/statusBar';

// import styles
import './monitor.scss';

const Monitor = ({ monitor }) => {
  const navigate = useNavigate();

  const { name, url, uptime = '0', heartbeats = [] } = monitor;
  const lastHeartbeat = heartbeats[heartbeats.length - 1];

  return (
    <div
      className="home-monitor-container"
      onClick={() => navigate(`/monitor/${monitor.monitorId}`)}
    >
      <div className="home-monitor-type">
        <div>{name}</div>
        <span>
          <FaEllipsisVertical width={20} height={20} />
        </span>
      </div>
      <a className="home-monitor-url" href={url} target="_blank">
        {url}
      </a>
      <div className="home-monitor-uptime-container">
        <div className="home-monitor-uptime">
          <h1>Ping</h1>
          <div>
            {!!lastHeartbeat?.latency
              ? `${lastHeartbeat?.latency} ms`
              : 'Unknown'}
          </div>
        </div>
        <div className="home-monitor-uptime">
          <h1>Uptime</h1>
          <div>{uptime}%</div>
        </div>
      </div>=
      <div className="home-monitor-status">
        <h1>Status</h1>
        <StatusBar heartbeats={heartbeats} />
      </div>
    </div>
  );
};

export default Monitor;
