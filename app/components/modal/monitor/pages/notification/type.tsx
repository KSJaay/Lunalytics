// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const notificationTypes = [
  'All',
  'Outage',
  //'Warning' , // TODO: Add warning notifications when ping is over x amount of ms
  'Recovery',
];

interface MonitorNotificationTypeProps {
  inputs: any;
  errors: any;
  handleInput: (key: string, value: any) => void;
}

const MonitorNotificationType = ({
  inputs,
  errors,
  handleInput,
}: MonitorNotificationTypeProps) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Notification Type</label>
      <label className="luna-input-subtitle">
        Select the notification type to trigger when the monitor state changes.
      </label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="notification-type-dropdown"
          color="var(--lunaui-accent-900)"
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
    </div>
  );
};

MonitorNotificationType.displayName = 'MonitorNotificationType';

export default MonitorNotificationType;
