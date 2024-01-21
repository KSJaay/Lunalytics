// import styles
import './top.scss';
import { parseUserCookie } from '../../utils/cookies';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../ui/dropdown/index';
import Logo from '../icons/logo';

const TopNavigation = () => {
  const user = parseUserCookie(window?.document?.cookie);
  const navigate = useNavigate();

  return (
    <div className="top-navigation">
      <div
        className="top-navigation-logo-container"
        onClick={() => navigate('/')}
      >
        <Logo size={50} />
        <div className="top-navigation-logo-text">Lunalytics</div>
      </div>
      <div className="top-navigation-right-container">
        <Dropdown.Container>
          <Dropdown.Trigger>
            <div className="top-navigation-right-username">
              {user.displayName}
            </div>
          </Dropdown.Trigger>

          <Dropdown.List position="right">
            <Dropdown.Item onClick={() => navigate('/settings')}>
              Settings
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/logout')}>
              Logout
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown.Container>
      </div>
    </div>
  );
};

export default TopNavigation;
