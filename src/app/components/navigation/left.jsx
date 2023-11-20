// import local files
import { FaCog, FaHome, FaSignOutAlt } from '../icons';

// import styles
import './left.scss';

const actionTabs = [
  {
    name: 'Home',
    url: '',
    logo: <FaHome width={28} height={28} />,
  },
];

const LeftNavigation = ({ activeUrl = '' }) => {
  const actions = actionTabs.map((action) => {
    const { name, url, logo } = action;

    return (
      <div
        className={`navigation-left-top-action${
          activeUrl === url ? '-active' : ''
        }`}
        key={name}
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
          >
            <FaCog width={28} height={28} />
          </div>
          <div className={`navigation-left-top-action`}>
            <FaSignOutAlt width={28} height={28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftNavigation;
