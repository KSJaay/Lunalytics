// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const textInputTypes = {
  http: 'HTTP',
  json: 'JSON Query',
  ping: 'Ping',
  tcp: 'TCP',
};

const MonitorInitialDropdown = ({ inputs, errors, handleInput }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();
  return (
    <>
      <label className="input-label">Monitor Type</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="type-dropdown"
        >
          {textInputTypes[inputs.type] || 'Select Monitor Type'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          <Dropdown.Item
            id="type-http"
            onClick={() => {
              handleInput('type', 'http');
              toggleDropdown();
            }}
          >
            {textInputTypes.http}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-json"
            onClick={() => {
              handleInput('type', 'json');
              toggleDropdown();
            }}
          >
            {textInputTypes['json']}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-ping"
            onClick={() => {
              handleInput('type', 'ping');
              toggleDropdown();
            }}
          >
            {textInputTypes.ping}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-tcp"
            onClick={() => {
              handleInput('type', 'tcp');
              toggleDropdown();
            }}
          >
            {textInputTypes.tcp}
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown.Container>
      {errors.type && (
        <label id="text-input-error-input-type" className="input-error">
          {errors.type}
        </label>
      )}
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
