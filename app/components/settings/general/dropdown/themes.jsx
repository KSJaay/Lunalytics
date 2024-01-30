import useDropdown from '../../../../hooks/useDropdown';
import useLocalStorageContext from '../../../../hooks/useLocalstorage';
import Dropdown from '../../../ui/dropdown/index';

const themes = { dark: 'Dark', light: 'Light' };

const ThemesDropdown = () => {
  const { theme, setTheme } = useLocalStorageContext();
  const { dropdownIsOpen, toggleDropdown } = useDropdown(false);

  return (
    <>
      <label className="text-input-label">Theme</label>
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
          {themes[theme]}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          <Dropdown.Item onClick={() => setTheme('dark')}>Dark</Dropdown.Item>
          <Dropdown.Item onClick={() => setTheme('light')}>Light</Dropdown.Item>
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default ThemesDropdown;
