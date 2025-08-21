// import dependencies
import { Button } from '@lunalytics/ui';

// import local files
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
          <Button fullWidth variant="outline">
            {dateformat}
          </Button>
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

export default SettingsPersonalisationDateformat;
