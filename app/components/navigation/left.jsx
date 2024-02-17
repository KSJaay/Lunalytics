// import styles
import './left.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

// import local files
import { FaCog, FaHome, FaSignOutAlt } from '../icons';

const actionTabs = [
  {
    name: 'Home',
    url: '/',
    logo: <FaHome width={28} height={28} />,
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
      <div className={classes} key={name} onClick={() => navigate(url)}>
        {logo}
      </div>
    );
  });

  return (
    <div className="left-navigation">
      <div className="left-actions">{actions}</div>
      <div className="left-actions-bottom">
        <div
          className={`navigation-left-top-action${
            activeUrl === 'settings' ? '-active' : ''
          }`}
          onClick={() => navigate('/settings')}
        >
          <FaCog width={28} height={28} />
        </div>
        <a
          className="navigation-left-top-action navigation-left-signout-button"
          href="/auth/logout"
        >
          <FaSignOutAlt width={28} height={28} />
        </a>
      </div>
    </div>
  );
};

LeftNavigation.displayName = 'LeftNavigation';

LeftNavigation.propTypes = {
  activeUrl: PropTypes.string,
};

export default LeftNavigation;
