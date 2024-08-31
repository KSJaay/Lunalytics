// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';
import useContextStore from '../../../../../context';
import { observer } from 'mobx-react-lite';

const MonitorNotificationList = ({ inputs, errors, handleInput }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const {
    notificationStore: { allNotifications },
  } = useContextStore();

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
          {inputs.notification?.toUpperCase() || 'Select Notification'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {allNotifications.map((notification) => (
            <Dropdown.Item
              id={`notification-item-${notification.id}`}
              onClick={() => {
                handleInput('notification', notification.id);
                toggleDropdown();
              }}
            >
              {notification.friendlyName}
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
