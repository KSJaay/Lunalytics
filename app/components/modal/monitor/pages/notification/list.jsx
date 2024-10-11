// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';
import useContextStore from '../../../../../context';
import NotificationIcon from '../../../notification/dropdown/icon';
import notificationsIcons from '../../../../../constant/notifications.json';

const MonitorNotificationList = ({ inputs, errors, handleInput }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const {
    notificationStore: { allNotifications, getNotifciationById },
  } = useContextStore();

  const selectedNotification = getNotifciationById(inputs.notificationId);

  return (
    <>
      <label className="input-label">Notification</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="notification-name-dropdown"
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
    </>
  );
};

MonitorNotificationList.displayName = 'MonitorNotificationList';

MonitorNotificationList.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default observer(MonitorNotificationList);
