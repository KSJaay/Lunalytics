import '../styles.scss';

// import dependencies
import { LuInfo } from 'react-icons/lu';
import { observer } from 'mobx-react-lite';
import { IoArrowBack } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

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

interface HomeMonitorHeaderProps {
  isInfoOpen?: boolean;
  setIsInfoOpen?: (isOpen: boolean) => void;
  rightChildren?: React.ReactNode;
  isMobile?: boolean;
}

const HomeMonitorHeader = ({
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
  isMobile = false,
}: HomeMonitorHeaderProps) => {
  const {
    userStore: { user },
    globalStore: { activeMonitor, setActiveMonitor },
  } = useContextStore();
  const { t } = useTranslation();

  const role = new Role('user', user.permission);
  const isEditor = role.hasPermission(PermissionsBits.MANAGE_MONITORS);

  if (!activeMonitor) {
    return (
      <div className="navigation-header-content">
        <div className="navigation-header-title">
          <div>{t('common.monitor')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="navigation-header-content">
      {isMobile ? (
        <div
          style={{ padding: '0 12px 0 6px' }}
          onClick={() => setActiveMonitor('mobile-reset')}
        >
          <IoArrowBack size={24} />
        </div>
      ) : null}
      <div className="navigation-header-title">
        <div>
          {t('common.monitor')} - {activeMonitor.name}
        </div>
        {activeMonitor?.url ? (
          <div className="navigation-header-subtitle">
            <span>{typeToText[activeMonitor.type]} </span>
            {t('home.header.subtitle') + ' '}
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
