// import dependencies
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';
import PillCircle from '../navigation/PillCircle';
import HomeMonitorsListContext from './context';

const HomeMonitorsList = ({ monitors = [] }) => {
  const {
    globalStore: { activeMonitor, setActiveMonitor },
  } = useContextStore();

  if (!activeMonitor) return null;

  const monitorsList = monitors.map((monitor) => {
    const classes = classNames('item', {
      'item-active': activeMonitor.monitorId === monitor.monitorId,
    });

    let heartbeats = monitor.heartbeats
      .map((heartbeat) =>
        heartbeat.isDown ? 'var(--red-800)' : 'var(--green-800)'
      )
      .splice(0, 12);

    if (heartbeats.length < 12) {
      const length = 12 - heartbeats.length;
      const emptyHeartbeats = Array.from({ length }).map(
        () => 'var(--gray-500)'
      );

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
            <PillCircle pills={heartbeats} />
          </div>
        </div>
      </HomeMonitorsListContext>
    );
  });

  return <div className="navigation-monitor-items">{monitorsList}</div>;
};

export default observer(HomeMonitorsList);
