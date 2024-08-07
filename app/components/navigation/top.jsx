// import styles
import './top.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';

// import local files
import Dropdown from '../ui/dropdown/index';
import StatusLogo from '../icons/statusLogo';
import Avatar from '../ui/avatar';
import useDropdown from '../../hooks/useDropdown';

const TopNavigation = () => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown(true);
  const navigate = useNavigate();

  return (
    <div className="top-navigation">
      <div
        className="top-navigation-logo-container"
        onClick={() => navigate('/')}
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
            <Avatar />
          </Dropdown.Trigger>

          <Dropdown.List position="right" isOpen={dropdownIsOpen}>
            <Dropdown.Item as="a" href="/settings">
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

export default TopNavigation;
