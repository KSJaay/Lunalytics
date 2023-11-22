// import local files
import Pill from '../ui/pill';

// import styles
import './monitor.scss';

const Monitor = ({ monitor }) => {
  // if (!monitor) {
  //   return <div>Loading...</div>;
  // }

  // const { type, name, url, ping, uptime } = monitor;

  return (
    <div className="home-monitor-container">
      <div className="home-monitor-type">Website</div>
      <div className="home-monitor-name">KSJaay</div>
      <div className="home-monitor-url">https://ksjaay.com/status</div>
      <div className="home-monitor-uptime-container">
        <div className="home-monitor-uptime">
          <h1>Ping</h1>
          <div>103 ms</div>
        </div>
        <div className="home-monitor-uptime">
          <h1>Uptime</h1>
          <div>99.8%</div>
        </div>
      </div>
      <div className="home-monitor-status">
        <h1>Status</h1>
        <div>
          <Pill />
        </div>
      </div>
    </div>
  );
};

export default Monitor;
