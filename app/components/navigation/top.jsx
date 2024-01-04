// import styles
import './top.scss';
import { parseUserCookie } from '../../utils/cookies';
import { useNavigate } from 'react-router-dom';

const TopNavigation = () => {
  const user = parseUserCookie(window?.document?.cookie);
  const navigate = useNavigate();

  return (
    <div className="top-navigation">
      <div
        className="top-navigation-logo-container"
        onClick={() => navigate('/')}
      >
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
