// import local files
import useDropdown from '../../hooks/useDropdown';
import useSetupFormContext from '../../hooks/useSetup';
import Dropdown from '../ui/dropdown';

const SetupDropdown = ({ id, options, label = 'Dropdown' }) => {
  const { handleInput, inputs } = useSetupFormContext();
  const { dropdownIsOpen, toggleDropdown } = useDropdown(false, 'Automatic');
  const value = inputs[id] || 'automatic';

  return (
    <>
      <label className="input-label">{label}</label>
      <Dropdown.Container
        position="center"
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        id={`setup-dropdown-${id}`}
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          asInput
        >
          {value?.charAt(0)?.toUpperCase() + value?.slice(1) ||
            'Select from dropdown'}
        </Dropdown.Trigger>

        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          {Object.values(options).map((item) => (
            <Dropdown.Item
              showDot
              key={item}
              dotColor="primary"
              isSelected={value === item}
              onClick={() => {
                handleInput({ target: { id, value: item } });
                toggleDropdown();
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

SetupDropdown.displayName = 'SetupDropdown';

export default SetupDropdown;
