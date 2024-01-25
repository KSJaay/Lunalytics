import useTheme from '../../../../hooks/useTheme';
import Dropdown from '../../../ui/dropdown/index';

const themes = { dark: 'Dark', light: 'Light' };

const ThemesDropdown = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <label className="text-input-label">Theme</label>
      <Dropdown.Container position="center">
        <Dropdown.Trigger asInput>{themes[theme.type]}</Dropdown.Trigger>
        <Dropdown.List fullWidth>
          <Dropdown.Item onClick={() => setTheme('dark')}>Dark</Dropdown.Item>
          <Dropdown.Item onClick={() => setTheme('light')}>Light</Dropdown.Item>
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default ThemesDropdown;
