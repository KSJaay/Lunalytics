// import dependencies
import PropTypes from 'prop-types';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';

const notifications = {
  Discord: { name: 'Discord', icon: 'discord.svg' },
  Slack: { name: 'Slack', icon: 'slack.svg' },
  Telegram: { name: 'Telegram', icon: 'telegram.svg' },
  Webhook: { name: 'Webhook', icon: 'webhook.svg' },
};

const NotificationModalPlatform = ({ isEdit, setPlatform, platform }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="input-label">Notification Type</label>
      {isEdit && (
        <Dropdown.Trigger asInput>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={`/notifications/${notifications[platform].icon}`}
              style={{ width: '22px' }}
            />
            <div>{notifications[platform].name}</div>
          </div>
        </Dropdown.Trigger>
      )}
      {!isEdit && (
        <Dropdown.Container
          position="right"
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="home-menu-layout"
        >
          <Dropdown.Trigger
            isOpen={dropdownIsOpen}
            toggleDropdown={toggleDropdown}
            asInput
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={`/notifications/${notifications[platform].icon}`}
                style={{ width: '22px' }}
              />
              <div>{notifications[platform].name}</div>
            </div>
          </Dropdown.Trigger>
          <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
            {Object.values(notifications).map((notification) => (
              <Dropdown.Item
                onClick={() => {
                  setPlatform({ key: 'platform', value: notification.name });
                  toggleDropdown();
                }}
                key={notification.name}
              >
                <img
                  src={`/notifications/${notification.icon}`}
                  style={{ width: '20px' }}
                />
                <div>{notification.name}</div>
              </Dropdown.Item>
            ))}
          </Dropdown.List>
        </Dropdown.Container>
      )}
    </>
  );
};

NotificationModalPlatform.displayName = 'NotificationModalPlatform';

NotificationModalPlatform.propTypes = {
  isEdit: PropTypes.bool,
  setPlatform: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
};

export default NotificationModalPlatform;
