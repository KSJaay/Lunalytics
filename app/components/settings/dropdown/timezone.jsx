import Dropdown from '../../ui/dropdown/index';
import timezones from '../../../constant/timeformats.json';
import useTime from '../../../hooks/useTime';

const TimezoneDropdown = () => {
  const { timezone, setTimezone } = useTime();

  const timezoneList = timezones.map((timezone) => (
    <Dropdown.Item
      key={timezone.value}
      onClick={() => setTimezone(timezone.value)}
    >
      {timezone.name}
    </Dropdown.Item>
  ));

  return (
    <>
      <label className="text-input-label">Timezone</label>
      <Dropdown.Container position="center">
        <Dropdown.Trigger asInput>{timezone}</Dropdown.Trigger>
        <Dropdown.List fullWidth>{timezoneList}</Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default TimezoneDropdown;
