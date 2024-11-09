// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const notificationTypes = [
  'All',
  'Outage',
  //'Warning' , // TODO: Add warning notifications when ping is over x amount of ms
  'Recovery',
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
          {inputs.notificationType}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {notificationTypes.map((type) => (
            <Dropdown.Item
              key={type}
              id={type}
              onClick={() => {
                handleInput('notificationType', type);
                toggleDropdown();
              }}
            >
              {type}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
      {errors.notificationType && (
        <label id="dropdown-error-notification-type" className="input-error">
          {errors.notificationType}
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
