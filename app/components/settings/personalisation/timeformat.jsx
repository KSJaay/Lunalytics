// import dependencies
import PropTypes from 'prop-types';

// import local files
import Button from '../../ui/button';
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';

const times = {
  'HH:mm:ss': '23:59:59',
  'HH:mm': '23:59',
  'hh:mm': '11:59',
  'hh:mm A': '11:59 PM',
};

const SettingsPersonalisationTimeformat = ({ timeformat, setTimeformat }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <div style={{ flex: 1 }}>
      <div className="settings-subtitle">Time Format</div>
      <Dropdown.Container
        position="left"
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        id="home-menu-layout"
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <Button fullWidth>{times[timeformat]}</Button>
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {Object.keys(times).map((time) => (
            <Dropdown.Item
              key={time}
              onClick={() => setTimeformat(time)}
              showDot
              isSelected={time === timeformat}
            >
              {times[time]}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </div>
  );
};

SettingsPersonalisationTimeformat.displayName =
  'SettingsPersonalisationTimeformat';

SettingsPersonalisationTimeformat.propTypes = {
  timeformat: PropTypes.string.isRequired,
  setTimeformat: PropTypes.func.isRequired,
};

export default SettingsPersonalisationTimeformat;
