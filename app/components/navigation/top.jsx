// import styles
import './top.scss';
import { parseUserCookie } from '../../utils/cookies';
import { useNavigate } from 'react-router-dom';
import {
  DropdownContainer,
  DropdownTrigger,
  DropdownList,
  DropdownItem,
} from '../ui/details';

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
        <div className="top-navigation-logo-text">Lunalytics</div>
      </div>
      <div className="top-navigation-right-container">
        <DropdownContainer>
          <DropdownTrigger>
            <div className="top-navigation-right-username">
              {user.displayName}
            </div>
          </DropdownTrigger>

          <DropdownList position="right">
            <DropdownItem onClick={() => navigate('/settings')}>
              Settings
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/logout')}>
              Logout
            </DropdownItem>
          </DropdownList>
        </DropdownContainer>
      </div>
    </div>
  );
};

export default TopNavigation;
