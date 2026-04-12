// import styles
import './left.scss';

// import dependencies
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { Avatar, Dropdown, Tooltip } from '@lunalytics/ui';

// import local files
import LeftUpdateButton from './left/update';
import MonitorPreview from '../home/preview';
import useUserContext from '../../context/user';
import useModalContext from '../../context/modal';
import IncidentPreview from '../incident/preview';
import StatusPagePreview from '../status/preview';
import useMemberContext from '../../context/member';
import LeftNavigationSettings from './left/settings';
import NotificationPreview from '../notifications/preview';
import { FaCog, FaHome, MdNotifications, PiBroadcast } from '../icons';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags';
import LeftNavigationAdminPanel from './left/adminPanel';

const actionTabs = [
  {
    key: 'common.home',
    url: '/home',
    logo: <FaHome style={{ width: '28px', height: '28px' }} />,
    Preview: MonitorPreview,
    permissionRequired: MemberPermissionBits.VIEW_MONITORS,
  },
  {
    key: 'common.notifications',
    url: '/notifications',
    logo: <MdNotifications style={{ width: '28px', height: '28px' }} />,
    Preview: NotificationPreview,
    permissionRequired: MemberPermissionBits.VIEW_NOTIFICATIONS,
  },
  {
    key: 'common.status',
    url: '/status-pages',
    logo: <PiBroadcast style={{ width: '28px', height: '28px' }} />,
    Preview: StatusPagePreview,
    permissionRequired: MemberPermissionBits.VIEW_STATUS_PAGES,
  },
  {
    key: 'common.incidents',
    url: '/incidents',
    logo: <BsFillShieldLockFill style={{ width: '25px', height: '25px' }} />,
    Preview: IncidentPreview,
    permissionRequired: MemberPermissionBits.VIEW_INCIDENTS,
  },
];

const isImageUrl = (url: string) => {
  if (typeof url !== 'string') {
    return false;
  }

  return url.match(/^https?:\/\//gim);
};

const LeftNavigation = observer(({ activeUrl }: { activeUrl: string }) => {
  const navigate = useNavigate();
  const { closeModal, openModal, openSettings } = useModalContext();

  const {
    user: { avatar, displayName },
  } = useUserContext();

  const { member } = useMemberContext();

  const { t } = useTranslation();

  const isUrl = isImageUrl(avatar);
  const imageUrl = isUrl ? avatar : `/icons/${avatar}.png`;

  const actions = actionTabs.map((action) => {
    const { key, url, logo, Preview, permissionRequired } = action;

    if (!member?.role.hasPermission(permissionRequired)) return null;

    const classes = classNames({
      'navigation-left-action': true,
      active: activeUrl === url,
    });

    const content = (
      <div
        className={classes}
        key={key}
        tabIndex={1}
        onClick={() => navigate(url)}
      >
        {logo}
      </div>
    );

    if (!Preview) {
      return (
        <Tooltip position="right" text={t(key)} key={key} color="gray">
          {content}
        </Tooltip>
      );
    }

    return <Preview key={key}>{content}</Preview>;
  });

  return (
    <aside className="left-navigation-container">
      <div className="left-navigation-logo">
        <img src="/logo.svg" alt="Lunalytics" style={{ width: '50px' }} />
      </div>
      <div className="left-navigation-actions">{actions}</div>

      <div className="navigation-settings-container">
        <LeftUpdateButton closeModal={closeModal} openModal={openModal} />

        <div
          className="navigation-left-action"
          onClick={() => openSettings(<LeftNavigationSettings />)}
        >
          <FaCog size={28} />
        </div>
        <Dropdown
          items={[
            {
              id: 'admin',
              text: 'Admin Panel',
              type: 'item',
              onClick: () => {
                openSettings(<LeftNavigationAdminPanel />);
              },
            },
            {
              id: 'logout',
              text: 'Logout',
              type: 'item',
              onClick: () => (window.location.href = '/api/auth/logout'),
            },
          ]}
          position="right"
          hideIcon
          className="navigation-avatar-dropdown"
        >
          <div style={{ borderRadius: '100%', overflow: 'hidden' }}>
            <Avatar avatar={imageUrl} name={displayName} showName={false} />
          </div>
        </Dropdown>
      </div>
    </aside>
  );
});

LeftNavigation.displayName = 'LeftNavigation';

export default LeftNavigation;
