// import local files
import { useNavigate } from 'react-router-dom';
import { FaCog, FaHome, FaSignOutAlt } from '../icons';

// import styles
import './left.scss';

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

    return (
      <div
        className={`navigation-left-top-action${
          activeUrl === url ? '-active' : ''
        }`}
        key={name}
        onClick={() => navigate(url)}
      >
        {logo}
      </div>
    );
  });

  return (
    <div className="left-navigation">
      <div className="left-actions">
        <div>{actions}</div>
      </div>
      <div>
        <div>
          <div
            className={`navigation-left-top-action${
              activeUrl === 'settings' ? '-active' : ''
            }`}
            onClick={() => navigate('/settings')}
          >
            <FaCog width={28} height={28} />
          </div>
          <a className="navigation-left-top-action" href="/logout">
            <FaSignOutAlt width={28} height={28} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftNavigation;
