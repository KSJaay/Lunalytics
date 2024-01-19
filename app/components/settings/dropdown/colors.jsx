import useTheme from '../../../hooks/useTheme';
import Dropdown from '../../ui/dropdown/index';

const colors = ['Blue', 'Cyan', 'Green', 'Pink', 'Purple', 'Red', 'Yellow'];

const ColorsDropdown = () => {
  const { theme, setColor } = useTheme();

  const colorsList = colors.map((color) => (
    <Dropdown.Item key={color} onClick={() => setColor(color)}>
      {color}
    </Dropdown.Item>
  ));

  const colorName =
    theme.color?.charAt(0).toUpperCase() + theme.color?.slice(1);

  return (
    <>
      <label className="text-input-label">Color</label>
      <Dropdown.Container position="center">
        <Dropdown.Trigger asInput>{colorName}</Dropdown.Trigger>
        <Dropdown.List fullWidth>{colorsList}</Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default ColorsDropdown;
