import useDropdown from '../../../../hooks/useDropdown';
import useLocalStorageContext from '../../../../hooks/useLocalstorage';
import Dropdown from '../../../ui/dropdown/index';

const colors = ['Blue', 'Cyan', 'Green', 'Pink', 'Purple', 'Red', 'Yellow'];

const ColorsDropdown = () => {
  const { color: stateColor, setColor } = useLocalStorageContext();

  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const colorsList = colors.map((color) => (
    <Dropdown.Item
      key={color}
      onClick={() => setColor(color)}
      showDot
      dotColor={color.toLowerCase()}
      isSelected={stateColor === color}
    >
      {color}
    </Dropdown.Item>
  ));

  return (
    <>
      <label className="text-input-label">Color</label>
      <Dropdown.Container
        position="center"
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          showIcon
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          {stateColor}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {colorsList}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default ColorsDropdown;
