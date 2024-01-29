import useDropdown from '../../../../hooks/useDropdown';
import useTheme from '../../../../hooks/useTheme';
import Dropdown from '../../../ui/dropdown/index';

const colors = ['Blue', 'Cyan', 'Green', 'Pink', 'Purple', 'Red', 'Yellow'];

const ColorsDropdown = () => {
  const { theme, setColor } = useTheme();

  const { dropdownIsOpen, toggleDropdown } = useDropdown(false);

  const colorsList = colors.map((color) => (
    <Dropdown.Item
      key={color}
      onClick={() => setColor(color)}
      showDot
      dotColor={color.toLowerCase()}
      isSelected={theme.color === color}
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
          {theme.color}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {colorsList}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default ColorsDropdown;
