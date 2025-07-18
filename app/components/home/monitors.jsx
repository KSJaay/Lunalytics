// import dependencies
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';
import PillCircle from '../navigation/PillCircle';
import HomeMonitorsListContext from './context';

const HomeMonitorsList = () => {
  const {
    globalStore: { activeMonitor, setActiveMonitor, allMonitors: monitors },
  } = useContextStore();

  if (!activeMonitor) return null;

  const monitorsList = monitors.map((monitor) => {
    const classes = classNames('item', {
      'item-active': activeMonitor.monitorId === monitor.monitorId,
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
      <HomeMonitorsListContext
        monitorId={monitor.monitorId}
        key={monitor.monitorId}
      >
        <div
          className={classes}
          onClick={() => setActiveMonitor(monitor.monitorId)}
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
      </HomeMonitorsListContext>
    );
  });

  return <div className="navigation-monitor-items">{monitorsList}</div>;
};

export default observer(HomeMonitorsList);
