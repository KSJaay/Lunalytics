import './statusBar.scss';

const StatusBar = ({ heartbeats = {}, maxHeartbeats = 12 }) => {
  const heartbeatList = [];

  for (let i = 0; i < maxHeartbeats; i++) {
    const heartbeat = heartbeats[i];
    if (heartbeat) {
      heartbeatList.push(
        <div
          key={heartbeat.id}
          className={
            heartbeat.isDown
              ? 'status-bar status-bar-alert'
              : 'status-bar status-bar-healthy'
          }
        ></div>
      );
    } else {
      heartbeatList.push(<div className="status-bar status-bar-unknown"></div>);
    }
  }

  return (
    <div
      className="status-bar-container"
      style={{ gridTemplateColumns: `repeat(${maxHeartbeats}, 1fr)` }}
    >
      {heartbeatList}
    </div>
  );
};

export default StatusBar;
