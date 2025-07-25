// import styles
import './left.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Avatar, Tooltip } from '@lunalytics/ui';
import { BsFillShieldLockFill } from 'react-icons/bs';

// import local files
import useContextStore from '../../context';
import MonitorPreview from '../home/preview';
import IncidentPreview from '../incident/preview';
import StatusPagePreview from '../status/preview';
import NotificationPreview from '../notifications/preview';
import { FaCog, FaHome, MdNotifications, PiBroadcast } from '../icons';

const actionTabs = [
  {
    name: 'Home',
    url: '/home',
    logo: <FaHome style={{ width: '28px', height: '28px' }} />,
    Preview: MonitorPreview,
  },
  {
    name: 'Notifications',
    url: '/notifications',
    logo: <MdNotifications style={{ width: '28px', height: '28px' }} />,
    Preview: NotificationPreview,
  },
  {
    name: 'Status',
    url: '/status-pages',
    logo: <PiBroadcast style={{ width: '28px', height: '28px' }} />,
    Preview: StatusPagePreview,
  },
  {
    name: 'Incidents',
    url: '/incidents',
    logo: <BsFillShieldLockFill style={{ width: '25px', height: '25px' }} />,
    Preview: IncidentPreview,
  },
];

const isImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }

  return url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/gim);
};

const LeftNavigation = ({ activeUrl }) => {
  const navigate = useNavigate();
  const {
    userStore: {
      user: { avatar, displayName },
    },
  } = useContextStore();

  const isUrl = isImageUrl(avatar);
  const imageUrl = isUrl ? avatar : `/icons/${avatar}.png`;

  const actions = actionTabs.map((action) => {
    const { name, url, logo, Preview } = action;

    const classes = classNames({
      'navigation-left-action': true,
      active: activeUrl === url,
    });

    const content = (
      <div
        className={classes}
        key={name}
        tabIndex={1}
        onClick={() => navigate(url)}
      >
        {logo}
      </div>
    );

    if (!Preview) {
      return (
        <Tooltip position="right" text={name} key={name} color="gray">
          {content}
        </Tooltip>
      );
    }

    return <Preview key={name}>{content}</Preview>;
  });

  return (
    <aside className="left-navigation-container">
      <div className="left-navigation-logo">
        <img src="/logo.svg" alt="Lunalytics" style={{ width: '50px' }} />
      </div>
      <div className="left-navigation-actions">{actions}</div>

      <div className="navigation-settings-container">
        <div
          className="navigation-left-action"
          onClick={() => navigate('/settings')}
        >
          <FaCog size={28} />
        </div>
        <div style={{ borderRadius: '100%', overflow: 'hidden' }}>
          <Avatar avatar={imageUrl} name={displayName} showName={false} />
        </div>
      </div>
    </aside>
  );
};

LeftNavigation.displayName = 'LeftNavigation';

LeftNavigation.propTypes = {
  activeUrl: PropTypes.string,
};

export default observer(LeftNavigation);
