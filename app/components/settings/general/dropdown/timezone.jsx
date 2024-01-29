import Dropdown from '../../../ui/dropdown/index';
import timezones from '../../../../constant/timeformats.json';
import useTime from '../../../../hooks/useTime';
import useDropdown from '../../../../hooks/useDropdown';

const TimezoneDropdown = () => {
  const { timezone, setTimezone } = useTime();
  const { dropdownIsOpen, toggleDropdown } = useDropdown(false);

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
