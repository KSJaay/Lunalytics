// import dependencies
import PropTypes from 'prop-types';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';

const NotificationModalType = ({ messageType = 'basic', setMessageType }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="input-label">Message Type</label>
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
          {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          {['Basic', 'Pretty', 'Nerdy'].map((type) => (
            <Dropdown.Item
              key={type}
              onClick={() => {
                setMessageType({
                  key: 'messageType',
                  value: type.toLowerCase(),
                });
                toggleDropdown();
              }}
            >
              {type}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

NotificationModalType.displayName = 'NotificationModalType';

NotificationModalType.propTypes = {
  messageType: PropTypes.oneOf(['basic', 'pretty', 'nerdy']),
  setMessageType: PropTypes.func,
};

export default NotificationModalType;
