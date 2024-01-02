import './statusBar.scss';

const StatusBar = ({ heartbeats = {} }) => {
  const heartbeatList = [];

  for (let i = 0; i < 12; i++) {
    const heartbeat = heartbeats[i];
    if (heartbeat) {
      heartbeatList.push(
        <div
          className={
            heartbeat.isDown ? 'status-bar-alert' : 'status-bar-healthy'
          }
        ></div>
      );
    } else {
      heartbeatList.push(<div className="status-bar-unknown"></div>);
    }
  }

  return <div className="status-bar-container">{heartbeatList}</div>;
};

export default StatusBar;
