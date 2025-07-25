import '../styles.scss';

// import dependencies
import { observer } from 'mobx-react-lite';
import { LuInfo } from 'react-icons/lu';

// import local files
import HomeMonitorHeaderMenu from './menu';
import useContextStore from '../../../context';
import Role from '../../../../shared/permissions/role';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';

const typeToText = {
  http: 'HTTP/S',
  json: 'JSON Query',
  ping: 'Ping',
  tcp: 'TCP',
};

const HomeMonitorHeader = ({ isInfoOpen, setIsInfoOpen, rightChildren }) => {
  const {
    userStore: { user },
    globalStore: { activeMonitor = {} },
  } = useContextStore();

  const role = new Role('user', user.permission);
  const isEditor = role.hasPermission(PermissionsBits.MANAGE_MONITORS);

  if (!activeMonitor) {
    return (
      <div className="navigation-header-content">
        <div className="navigation-header-title">
          <div>Monitor</div>
        </div>
      </div>
    );
  }

  return (
    <div className="navigation-header-content">
      <div className="navigation-header-title">
        <div>Monitor - {activeMonitor.name}</div>
        {activeMonitor?.url ? (
          <div className="navigation-header-subtitle">
            <span>{typeToText[activeMonitor.type]} </span>
            monitor for{' '}
            <a href={activeMonitor.url} target="_blank" rel="noreferrer">
              {activeMonitor.url}
            </a>
          </div>
        ) : null}
      </div>
      <div className="navigation-header-buttons">
        {isEditor ? <HomeMonitorHeaderMenu /> : null}
        {rightChildren ? (
          <div onClick={() => setIsInfoOpen(!isInfoOpen)}>
            <LuInfo size={20} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default observer(HomeMonitorHeader);
