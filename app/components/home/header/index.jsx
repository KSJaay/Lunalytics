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

const HomeMonitorHeader = ({
  monitor,
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
}) => {
  const {
    userStore: { user },
  } = useContextStore();

  const role = new Role('user', user.permission);
  const isEditor = role.hasPermission(PermissionsBits.MANAGE_MONITORS);

  return (
    <div className="navigation-header-content">
      <div className="navigation-header-title">
        <div>
          Monitor {'>'} {monitor?.name}
        </div>
        {monitor?.url ? (
          <div className="monitor-header-subtitle">
            <span>{typeToText[monitor.type]} </span>
            monitor for{' '}
            <a href={monitor.url} target="_blank" rel="noreferrer">
              {monitor.url}
            </a>
          </div>
        ) : null}
      </div>
      <div className="navigation-header-buttons">
        {isEditor ? <HomeMonitorHeaderMenu monitor={monitor} /> : null}
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
