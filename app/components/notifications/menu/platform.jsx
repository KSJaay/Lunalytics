// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../ui/dropdown';
import Button from '../../ui/button';

// import icons
import { MdNotifications, RiStackFill } from '../../icons';

const statusOptions = [
  {
    text: 'All',

    icon: (
      <div
        style={{
          color: 'var(--primary-500)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MdNotifications style={{ width: '20px', height: '20px' }} />
      </div>
    ),
  },
  {
    text: 'Discord',
    icon: '/notifications/discord.svg',
  },
  {
    text: 'Slack',
    icon: '/notifications/slack.svg',
  },
  {
    text: 'Telegram',
    icon: '/notifications/telegram.svg',
  },
  {
    text: 'Webhook',
    icon: '/notifications/webhook.svg',
  },
];

const MenuPlatformDropdown = ({ platform, setPlatform }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown(false, 'all');

  const dropdownItems = statusOptions.map((view) => (
    <Dropdown.Item
      key={view.text}
      showDot={view.text === platform}
      isSelected={platform === view.text}
      onClick={() => setPlatform(view.text)}
    >
      <div className="layout-option">
        {typeof view.icon === 'string' ? (
          <img
            src={view.icon}
            alt={view.text}
            style={{ width: '20px', height: '20px' }}
          />
        ) : (
          view.icon
        )}
        {view.text}
      </div>
    </Dropdown.Item>
  ));

  return (
    <Dropdown.Container
      position="center"
      isOpen={dropdownIsOpen}
      toggleDropdown={toggleDropdown}
      id="home-menu-status"
    >
      <Dropdown.Trigger isOpen={dropdownIsOpen} toggleDropdown={toggleDropdown}>
        <Button
          iconLeft={<RiStackFill style={{ width: '20px', height: '20px' }} />}
        >
          Platform
        </Button>
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>{dropdownItems}</Dropdown.List>
    </Dropdown.Container>
  );
};

MenuPlatformDropdown.displayName = 'MenuPlatformDropdown';

MenuPlatformDropdown.propTypes = {
  platform: PropTypes.string,
  setPlatform: PropTypes.func,
};

export default MenuPlatformDropdown;
