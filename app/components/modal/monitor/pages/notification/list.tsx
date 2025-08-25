// import dependencies
import { observer } from 'mobx-react-lite';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';
import useContextStore from '../../../../../context';
import NotificationIcon from '../../../notification/dropdown/icon';
import notificationsIcons from '../../../../../constant/notifications.json';

interface MonitorNotificationListProps {
  inputs: any;
  errors: any;
  handleInput: (key: string, value: any) => void;
}

const MonitorNotificationList = ({
  inputs,
  errors,
  handleInput,
}: MonitorNotificationListProps) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const {
    notificationStore: { allNotifications, getNotifciationById },
  } = useContextStore();

  const selectedNotification = getNotifciationById(inputs.notificationId);

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Notification</label>
      <label className="luna-input-subtitle">
        Select the notification to trigger when the monitor state changes.
      </label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="notification-name-dropdown"
          color="var(--lunaui-accent-900)"
        >
          {selectedNotification?.friendlyName ? (
            <NotificationIcon
              name={selectedNotification.friendlyName}
              icon={notificationsIcons[selectedNotification.platform].icon}
            />
          ) : (
            'Select Notification'
          )}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {allNotifications.map((notification) => (
            <Dropdown.Item
              id={`notification-item-${notification.id}`}
              onClick={() => {
                handleInput('notificationId', notification.id);
                toggleDropdown();
              }}
              key={notification.id}
            >
              <NotificationIcon
                name={notification.friendlyName}
                icon={notificationsIcons[notification.platform].icon}
              />
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
      {errors.type && (
        <label id="dropdown-error-notification-name" className="input-error">
          {errors.type}
        </label>
      )}
    </div>
  );
};

MonitorNotificationList.displayName = 'MonitorNotificationList';

export default observer(MonitorNotificationList);
