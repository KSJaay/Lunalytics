// import styles
import './left.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from '@lunalytics/ui';
import { useNavigate } from 'react-router-dom';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { Avatar } from '@lunalytics/ui';

// import local files
import { FaCog, FaHome, MdNotifications, PiBroadcast } from '../icons';

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

const LeftNavigation = ({ activeUrl }) => {
  const navigate = useNavigate();

  const actions = actionTabs.map((action) => {
    const { name, url, logo } = action;

    const classes = classNames({
      'navigation-left-top-action': true,
      'navigation-left-top-action-active': activeUrl === url,
    });

    return (
      <Tooltip text={name} position="right" key={name} color="gray">
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
    <aside
      style={{
        width: '75px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 0',
        }}
      >
        <img src="logo.svg" alt="Lunalytics" style={{ width: '50px' }} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: 1,
          paddingTop: '1rem',
          alignItems: 'center',
        }}
      >
        {actions}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingBottom: '1rem',
          alignItems: 'center',
        }}
      >
        <div>
          <FaCog size={28} />
        </div>
        <div style={{ borderRadius: '100%', overflow: 'hidden' }}>
          <Avatar avatar={'https://picsum.photos/240/240'} />
        </div>
      </div>
    </aside>
  );
};

LeftNavigation.displayName = 'LeftNavigation';

LeftNavigation.propTypes = {
  activeUrl: PropTypes.string,
};

export default LeftNavigation;
