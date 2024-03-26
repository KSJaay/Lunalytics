// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const MonitorInitialDropdown = ({ inputs, errors, handleInput }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();
  return (
    <>
      <label className="text-input-label">Monitor Type</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          {inputs.type?.toUpperCase() || 'Select Monitor Type'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          <Dropdown.Item
            onClick={() => {
              handleInput('type', 'http');
              toggleDropdown();
            }}
          >
            HTTP
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleInput('type', 'tcp');
              toggleDropdown();
            }}
          >
            TCP
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown.Container>
      {errors.type && <label className="text-input-error">{errors.type}</label>}
    </>
  );
};

MonitorInitialDropdown.displayName = 'MonitorInitialDropdown';

MonitorInitialDropdown.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorInitialDropdown;
