// import local files
import NotificationIcon from './icon';
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';
import notificationsIcons from '../../../../constant/notifications.json';
import type {
  NotificationPlatforms,
  NotificationProps,
} from '../../../../types/notifications';

interface NotificationModalPlatformProps {
  isEdit?: boolean;
  setPlatform: (platform: {
    key: keyof NotificationProps;
    value: string;
  }) => void;
  platform: NotificationPlatforms;
}

const NotificationModalPlatform = ({
  isEdit,
  setPlatform,
  platform,
}: NotificationModalPlatformProps) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="input-label">Notification Type</label>
      {isEdit && (
        <Dropdown.Trigger asInput isOpen={dropdownIsOpen}>
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
            id="notification-type-dropdown"
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
                  setPlatform({ key: 'platform', value: notification.id });
                  toggleDropdown();
                }}
                key={notification.id}
                id={`notification-type-${notification.id}`}
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

export default NotificationModalPlatform;
