// import dependencies
import PropTypes from 'prop-types';

// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
const defaultValue = 'Select a method';

const MonitorHttpMethods = ({ handleSelect, selectValue = defaultValue }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="text-input-label">Method</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          {selectValue}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {methods.map((method) => (
            <Dropdown.Item
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
    </>
  );
};

MonitorHttpMethods.displayName = 'MonitorHttpMethods';

MonitorHttpMethods.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  selectValue: PropTypes.string,
};

export default MonitorHttpMethods;
