// import styles
import './top.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@lunalytics/ui';

// import local files
import Dropdown from '../ui/dropdown/index';
import { StatusLogo } from '../icons';
import useDropdown from '../../hooks/useDropdown';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';

const isImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  return url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/gim) !== null;
};

const TopNavigation = () => {
  const {
    userStore: {
      user: { avatar, displayName },
    },
  } = useContextStore();
  const { dropdownIsOpen, toggleDropdown } = useDropdown(true);
  const navigate = useNavigate();

  const avatarUrl =
    !avatar || isImageUrl(avatar) ? avatar : `/icons/${avatar}.png`;

  return (
    <div className="top-navigation">
      <div
        className="top-navigation-logo-container"
        onClick={() => navigate('/home')}
      >
        <StatusLogo size={50} />
        <div className="top-navigation-logo-text">Lunalytics</div>
      </div>
      <div className="top-navigation-right-container">
        <Dropdown.Container
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <Dropdown.Trigger
            isOpen={dropdownIsOpen}
            toggleDropdown={toggleDropdown}
          >
            <Avatar avatar={avatarUrl} name={displayName} />
          </Dropdown.Trigger>

          <Dropdown.List position="right" isOpen={dropdownIsOpen}>
            <Dropdown.Item onClick={() => navigate('/settings')}>
              Settings
            </Dropdown.Item>
            <Dropdown.Item as="a" href="/auth/logout">
              Logout
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown.Container>
      </div>
    </div>
  );
};

export default observer(TopNavigation);
