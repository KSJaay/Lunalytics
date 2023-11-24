// import local files
import FaEllipsisVertical from '../icons/faEllipsisVertical';
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
      <div className="home-monitor-type">
        <div>Website</div>
        <span>
          <FaEllipsisVertical width={20} height={20} />
        </span>
      </div>
      <div className="home-monitor-name">KSJaay</div>
      <a
        className="home-monitor-url"
        href="https://ksjaay.com/status"
        target="_blank"
      >
        https://ksjaay.com/status
      </a>
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
