// import styles
import './left.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from '@lunalytics/ui';
import { useNavigate } from 'react-router-dom';
import { BsFillShieldLockFill } from 'react-icons/bs';

// import local files
import {
  FaCog,
  FaHome,
  FaSignOutAlt,
  MdNotifications,
  PiBroadcast,
} from '../icons';

const actionTabs = [
  {
    name: 'Home',
    url: '/home',
    logo: <FaHome style={{ width: '28px', height: '28px' }} />,
  },
  {
    name: 'Notifications',
    url: '/notifications',
    logo: <MdNotifications style={{ width: '28px', height: '28px' }} />,
  },
  {
    name: 'Status',
    url: '/status-pages',
    logo: <PiBroadcast style={{ width: '28px', height: '28px' }} />,
  },
  {
    name: 'Incidents',
    url: '/incidents',
    logo: <BsFillShieldLockFill style={{ width: '25px', height: '25px' }} />,
  },
];

const LeftNavigation = ({ activeUrl = '' }) => {
  const navigate = useNavigate();

  const actions = actionTabs.map((action) => {
    const { name, url, logo } = action;

    const classes = classNames({
      'navigation-left-top-action': true,
      'navigation-left-top-action-active': activeUrl === url,
    });

    return (
      <Tooltip text={name} position="right" key={name}>
        <div
          className={classes}
          key={name}
          tabIndex={1}
          onClick={() => navigate(url)}
        >
          {logo}
        </div>
      </Tooltip>
    );
  });

  return (
    <div className="left-navigation">
      <div className="left-actions">{actions}</div>
      <div className="left-actions-bottom">
        <Tooltip text="Settings" position="right" key="settings">
          <div
            className={`navigation-left-top-action${
              activeUrl === 'settings' ? '-active' : ''
            }`}
            onClick={() => navigate('/settings')}
            tabIndex={1}
          >
            <FaCog style={{ width: '28px', height: '28px' }} />
          </div>
        </Tooltip>
        <Tooltip text="Logout" position="right" key="logout">
          <a
            className="navigation-left-top-action navigation-left-signout-button"
            href="/auth/logout"
            tabIndex={1}
          >
            <FaSignOutAlt style={{ width: '28px', height: '28px' }} />
          </a>
        </Tooltip>
      </div>
    </div>
  );
};

LeftNavigation.displayName = 'LeftNavigation';

LeftNavigation.propTypes = {
  activeUrl: PropTypes.string,
};

export default LeftNavigation;
