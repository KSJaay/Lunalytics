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

const Monitor = () => {
  const {
    globalStore: { activeMonitor },
  } = useContextStore();

  if (!activeMonitor) {
    return null;
  }

  return (
    <div className="monitor-container">
      <MonitorStatus monitor={activeMonitor} />
      <MonitorGraph monitor={activeMonitor} />
      <MonitorUptime heartbeats={activeMonitor.heartbeats} />
      <Spacer size={18} />
    </div>
  );
};

Monitor.displayName = 'MonitorPage';

Monitor.propTypes = {
  monitor_id: PropTypes.string,
};

export default observer(Monitor);
