// import dependencies
import PropTypes from 'prop-types';

// import local files
import Button from '../../ui/button';
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';
import timeformats from '../../../constant/dateformats.json';

const SettingsPersonalisationDateformat = ({ dateformat, setDateformat }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <div style={{ flex: 1 }}>
      <div className="settings-subtitle">Date Format</div>
      <Dropdown.Container
        position="center"
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        id="home-menu-layout"
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <Button fullWidth>{dateformat}</Button>
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {timeformats.map((format) => (
            <Dropdown.Item
              key={format}
              onClick={() => setDateformat(format)}
              showDot
              isSelected={dateformat === format}
            >
              {format}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </div>
  );
};

SettingsPersonalisationDateformat.displayName =
  'SettingsPersonalisationDateformat';

SettingsPersonalisationDateformat.propTypes = {
  dateformat: PropTypes.string.isRequired,
  setDateformat: PropTypes.func.isRequired,
};

export default SettingsPersonalisationDateformat;
