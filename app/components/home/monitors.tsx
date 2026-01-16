// import dependencies
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';
import PillCircle from '../navigation/PillCircle';
import HomeMonitorsListContext from './context';
import type { ContextMonitorProps } from '../../../shared/types/context/global';
import { getMonitorsInOrder } from '../modal/navigation/reorder';

const HomeMonitorsList = ({
  monitors = [],
}: {
  monitors: ContextMonitorProps[];
}) => {
  const {
    userStore: { user },
    globalStore: { activeMonitor, setActiveMonitor, getMonitor },
  } = useContextStore();

  const monitorsList = getMonitorsInOrder(
    monitors,
    user?.settings?.monitorsList
  ).map((item) => {
    const monitor = getMonitor(item.monitorId);

    const classes = classNames('item', {
      'item-active': activeMonitor?.monitorId === monitor.monitorId,
    });

    let heartbeats: string[] = monitor.heartbeats
      .map((heartbeat) => {
        const downColor = monitor.paused ? 'var(--red-900)' : 'var(--red-800)';
        const upColor = monitor.paused
          ? 'var(--green-900)'
          : 'var(--green-800)';

        return heartbeat.isDown ? downColor : upColor;
      })
      .splice(0, 12);

    if (heartbeats.length < 12) {
      const length = 12 - heartbeats.length;
      const emptyHeartbeats = Array.from({ length }).map(
        () => 'var(--gray-500)'
      );

      heartbeats = heartbeats.concat(emptyHeartbeats);
    }

    const iconUrl = monitor.icon?.url || '/logo.svg';

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
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img src={iconUrl} style={{ width: '35px' }} />
            </div>
            <div>
              <div>{monitor.name}</div>
              <span>
                {monitor.type === 'push' ? 'Passive monitor' : monitor.url}
              </span>
            </div>
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
