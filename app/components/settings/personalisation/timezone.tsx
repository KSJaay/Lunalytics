// import dependencies
import PropTypes from 'prop-types';
import { Button } from '@lunalytics/ui';

// import local files
import Dropdown from '../../ui/dropdown';
import timezonesList from '../../../constant/timezones.json';
import useDropdown from '../../../hooks/useDropdown';

const SettingsPersonalisationTimezone = ({ timezone, setTimezone }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <div>
      <div className="settings-subtitle">Timezone</div>
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
          <Button fullWidth variant="outline">
            {timezone} (GMT{timezonesList[timezone]})
          </Button>
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {Object.keys(timezonesList).map((timezone) => (
            <Dropdown.Item key={timezone} onClick={() => setTimezone(timezone)}>
              {timezone} (GMT{timezonesList[timezone]})
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </div>
  );
};

SettingsPersonalisationTimezone.displayName = 'SettingsPersonalisationTimezone';

SettingsPersonalisationTimezone.propTypes = {
  timezone: PropTypes.string.isRequired,
  setTimezone: PropTypes.func.isRequired,
};

export default SettingsPersonalisationTimezone;
