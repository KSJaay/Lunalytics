// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const notificationTypes = [
  { name: 'All' },
  { name: 'Outage' },
  { name: 'Warning' },
  { name: 'Recovery' },
];

const MonitorNotificationType = ({ inputs, errors, handleInput }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="input-label">Notification Type</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="notification-type-dropdown"
        >
          {inputs.type?.toUpperCase() || 'Select Monitor Type'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {notificationTypes.map((type) => (
            <Dropdown.Item
              id={type.name}
              onClick={() => {
                handleInput('notificationType', type.name);
                toggleDropdown();
              }}
            >
              {type.name}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
      {errors.type && (
        <label id="dropdown-error-notification-type" className="input-error">
          {errors.type}
        </label>
      )}
    </>
  );
};

MonitorNotificationType.displayName = 'MonitorNotificationType';

MonitorNotificationType.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorNotificationType;
