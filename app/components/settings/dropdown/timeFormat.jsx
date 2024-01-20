import useTime from '../../../hooks/useTime';
import Dropdown from '../../ui/dropdown/index';

const times = {
  'HH:mm:ss': '23:59:59',
  'HH:mm': '23:59',
  'hh:mm': '11:59',
  'hh:mm A': '11:59 PM',
};

const TimeFormatDropdown = () => {
  const { timeformat, setTimeformat } = useTime();

  const timeFormatList = [
    { name: '23:59:59', value: 'HH:mm:ss' },
    { name: '23:59', value: 'HH:mm' },
    { name: '11:59', value: 'hh:mm' },
    { name: '11:59 PM', value: 'hh:mm A' },
  ].map((timeformat) => (
    <Dropdown.Item
      key={timeformat.value}
      onClick={() => setTimeformat(timeformat.value)}
    >
      {timeformat.name}
    </Dropdown.Item>
  ));

  return (
    <>
      <label className="text-input-label">Time Format</label>
      <Dropdown.Container position="center">
        <Dropdown.Trigger asInput>{times[timeformat]}</Dropdown.Trigger>
        <Dropdown.List fullWidth>{timeFormatList}</Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default TimeFormatDropdown;
