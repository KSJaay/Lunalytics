// import local files
import { useNavigate } from 'react-router-dom';
// import FaEllipsisVertical from '../icons/faEllipsisVertical';
import StatusBar from '../ui/statusBar';

// import styles
import './monitor.scss';
import { createGetRequest } from '../../services/axios';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import ContextStore from '../../context';
import FaTrash from '../icons/faTrash';

const Monitor = ({ monitor }) => {
  const navigate = useNavigate();

  const { name, url, uptimePercentage = '0', heartbeats = [] } = monitor;
  const [heartbeat] = heartbeats;
  const {
    globalStore: { removeMonitor },
  } = useContext(ContextStore);

  const handleDelete = async () => {
    await createGetRequest('/monitor/delete', {
      monitorId: monitor.monitorId,
    });

    removeMonitor(monitor.monitorId);
  };

  return (
    <div className="home-monitor-container">
      <div className="home-monitor-type" onClick={handleDelete}>
        <div>{name}</div>
        <span>
          <FaTrash width={20} height={20} />
        </span>
      </div>
      <a className="home-monitor-url">{url}</a>
      <div
        className="home-monitor-uptime-container"
        onClick={() => navigate(`/monitor/${monitor.monitorId}`)}
      >
        <div className="home-monitor-uptime">
          <h1>Ping</h1>
          <div>
            {!!heartbeat?.latency ? `${heartbeat?.latency} ms` : 'Unknown'}
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
    </div>
  );
};

export default observer(Monitor);
