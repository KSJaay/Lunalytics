import './style.scss';

// import node_modules
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import MonitorStatus from '../../components/monitor/status';
import MonitorGraph from '../../components/monitor/graph';
import MonitorUptime from '../../components/monitor/uptime';
import ContextStore from '../../context';
import Spacer from '../../components/ui/spacer';

const Monitor = ({ monitorId }) => {
  const {
    globalStore: { getMonitor },
  } = useContext(ContextStore);

  const monitor = getMonitor(monitorId);

  if (!monitor) {
    return null;
  }

  return (
    <div className="monitor-container">
      <MonitorStatus monitor={monitor} />
      <MonitorGraph heartbeats={monitor.heartbeats} />
      <MonitorUptime heartbeats={monitor.heartbeats} />
      <Spacer size={18} />
    </div>
  );
};

Monitor.displayName = 'MonitorPage';

export default observer(Monitor);
