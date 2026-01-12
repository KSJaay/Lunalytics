import '../styles.scss';

// import dependencies
import { LuInfo } from 'react-icons/lu';
import { observer } from 'mobx-react-lite';
import { IoArrowBack } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// import local files
import HomeMonitorHeaderMenu from './menu';
import useContextStore from '../../../context';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';
import type { MonitorType } from '../../../types/monitor';
import useMemberContext from '../../../context/member';

const typeToText = {
  docker: 'Docker Container',
  email: 'Email (SMTP)',
  http: 'HTTP/S',
  json: 'JSON Query',
  ping: 'Ping',
  push: 'Push',
  tcp: 'TCP',
};

interface HomeMonitorHeaderProps {
  isInfoOpen?: boolean;
  setIsInfoOpen?: (isOpen: boolean) => void;
  rightChildren?: React.ReactNode;
  isMobile?: boolean;
}

const HeaderSubtitle = ({ type, url }: { type: MonitorType; url: string }) => {
  const { t } = useTranslation();

  if (!type || !url) return null;

  if (type === 'push') {
    return (
      <div className="navigation-header-subtitle">
        <span>Passive push </span>
        monitor
      </div>
    );
  }

  return (
    <div className="navigation-header-subtitle">
      <span>{typeToText[type]} </span>
      {t('home.header.subtitle') + ' '}
      <a href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
    </div>
  );
};

const HomeMonitorHeader = ({
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
  isMobile = false,
}: HomeMonitorHeaderProps) => {
  const {
    globalStore: { activeMonitor, setActiveMonitor },
  } = useContextStore();

  const { member } = useMemberContext();

  const { t } = useTranslation();

  const isEditor = member?.role.hasPermission(PermissionsBits.MANAGE_MONITORS);

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
      <div className="navigation-header-title" id="monitor-view-menu-header">
        <div id="monitor-view-menu-name">
          {t('common.monitor')} - {activeMonitor.name}
        </div>
        <HeaderSubtitle type={activeMonitor.type} url={activeMonitor.url} />
      </div>
      <div className="navigation-header-buttons">
        {isEditor ? <HomeMonitorHeaderMenu /> : null}
        {rightChildren ? (
          <div onClick={() => setIsInfoOpen?.(!isInfoOpen)}>
            <LuInfo size={20} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default observer(HomeMonitorHeader);
