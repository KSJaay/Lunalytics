// import node_modules

// import styles
import './top.scss';
import { parseUserCookie } from '../../utils/cookies';

const TopNavigation = () => {
  const user = parseUserCookie(window?.document?.cookie);

  return (
    <div className="top-navigation">
      <div className="top-navigation-logo-container">
        <img src="/logo.svg" className="top-navigation-logo" />
        <div className="top-navigation-logo-text">Uptime Lunar</div>
      </div>
      <div className="top-navigation-right-container">
        <div className="top-navigation-right-username">{user.displayName}</div>
      </div>
    </div>
  );
};

export default TopNavigation;
