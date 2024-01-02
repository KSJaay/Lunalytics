import MonitorStatus from '../../components/monitor/status';
import MonitorGraph from '../../components/monitor/graph';
import MonitorUptime from '../../components/monitor/uptime';

const Monitor = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '10px',
        gap: '20px',
      }}
    >
      <MonitorStatus />
      <MonitorGraph />
      <MonitorUptime />
    </div>
  );
};

export default Monitor;
