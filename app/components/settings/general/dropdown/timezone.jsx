import timezones from '../../../../constant/timeformats.json';
import useDropdown from '../../../../hooks/useDropdown';
import useLocalStorageContext from '../../../../hooks/useLocalstorage';
import Dropdown from '../../../ui/dropdown/index';

const TimezoneDropdown = () => {
  const { timezone, setTimezone } = useLocalStorageContext();
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const timezoneList = timezones.map((time) => (
    <Dropdown.Item
      key={time.value}
      onClick={() => setTimezone(time.value)}
      showDot
      isSelected={time.value === timezone}
    >
      {time.name}
    </Dropdown.Item>
  ));

  return (
    <>
      <label className="text-input-label">Timezone</label>
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
          {timezone}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {timezoneList}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default TimezoneDropdown;
