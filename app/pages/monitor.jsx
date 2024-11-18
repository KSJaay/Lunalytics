import '../styles/pages/monitor.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import MonitorStatus from '../components/monitor/status';
import MonitorGraph from '../components/monitor/graph';
import MonitorUptime from '../components/monitor/uptime';
import Spacer from '../components/ui/spacer';
import useContextStore from '../context';
import MonitorMenu from '../components/monitor/menu';
import { useParams } from 'react-router-dom';

const Monitor = ({ monitor_id }) => {
  const {
    globalStore: { getMonitor },
  } = useContextStore();

  const query = useParams();
  const monitorId = query['monitor_id'] || monitor_id;

  const monitor = getMonitor(monitorId);

  if (!monitor) {
    return null;
  }

  return (
    <div className="monitor-container">
      <MonitorMenu monitorId={monitor.monitorId} name={monitor.name} />
      <MonitorStatus monitor={monitor} />
      <MonitorGraph monitor={monitor} />
      <MonitorUptime heartbeats={monitor.heartbeats} />
      <Spacer size={18} />
    </div>
  );
};

Monitor.displayName = 'MonitorPage';

Monitor.propTypes = {
  monitor_id: PropTypes.string,
};

export default observer(Monitor);
