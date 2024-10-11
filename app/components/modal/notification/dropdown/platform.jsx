// import dependencies
import PropTypes from 'prop-types';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';
import NotificationIcon from './icon';
import notificationsIcons from '../../../../constant/notifications.json';

const NotificationModalPlatform = ({ isEdit, setPlatform, platform }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="input-label">Notification Type</label>
      {isEdit && (
        <Dropdown.Trigger asInput>
          <NotificationIcon
            name={notificationsIcons[platform].name}
            icon={notificationsIcons[platform].icon}
          />
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
            <NotificationIcon
              name={notificationsIcons[platform].name}
              icon={notificationsIcons[platform].icon}
            />
          </Dropdown.Trigger>
          <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
            {Object.values(notificationsIcons).map((notification) => (
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
