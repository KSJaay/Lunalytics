import classNames from 'classnames';
import PillCircle from '../navigation/PillCircle';

const HomeMonitorsList = ({ monitors, selectedMonitor, setSelectedMonitor }) => {
  return monitors.map((monitor) => {
    const classes = classNames('item', {
      'item-active': selectedMonitor === monitor.monitorId,
    });

    let heartbeats = monitor.heartbeats
      .map((heartbeat) => {
        return heartbeat.isDown ? 'var(--red-800)' : 'var(--green-800)';
      })
      .splice(0, 12);

    if (heartbeats.length < 12) {
      const emptyHeartbeats = Array.from({
        length: 12 - heartbeats.length,
      }).map(() => 'var(--gray-500)');

      heartbeats = heartbeats.concat(emptyHeartbeats);
    }

    return (
      <div
        className={classes}
        onClick={() => setSelectedMonitor(monitor.monitorId)}
        key={monitor.monitorId}
      >
        <div className="content">
          <div>{monitor.name}</div>
          <span>{monitor.url}</span>
        </div>
        <div className="pill-container">
          <PillCircle
            size={35}
            pillWidth={10}
            pillHeight={3}
            pills={heartbeats}
          />
        </div>
      </div>
    );
  });
};

export default HomeMonitorsList;
