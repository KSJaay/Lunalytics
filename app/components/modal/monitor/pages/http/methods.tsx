// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
const defaultValue = 'Select a method';

const MonitorHttpMethods = ({
  error,
  handleSelect,
  selectValue = defaultValue,
}) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Method</label>
      <label className="luna-input-subtitle">
        Select the HTTP method to use for the request
      </label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="http-method-dropdown"
          color="var(--lunaui-accent-900)"
        >
          {selectValue}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {methods.map((method) => (
            <Dropdown.Item
              id={`http-method-${method}`}
              key={method}
              onClick={() => {
                handleSelect(method);
                toggleDropdown();
              }}
            >
              {method}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>

      {error && (
        <label className="input-error" id="text-input-http-method-error">
          {error}
        </label>
      )}
    </div>
  );
};

MonitorHttpMethods.displayName = 'MonitorHttpMethods';

MonitorHttpMethods.propTypes = {
  error: PropTypes.string,
  handleSelect: PropTypes.func.isRequired,
  selectValue: PropTypes.string,
};

export default MonitorHttpMethods;
