import Dropdown from '../../ui/dropdown/index';
import timeformats from '../../../constant/dateformats.json';
import useTime from '../../../hooks/useTime';

const DateFormatDropdown = () => {
  const { dateformat, setDateformat } = useTime();

  const dateFormatsList = timeformats.map((dateformat) => (
    <Dropdown.Item key={dateformat} onClick={() => setDateformat(dateformat)}>
      {dateformat}
    </Dropdown.Item>
  ));

  return (
    <>
      <label className="text-input-label">Date Format</label>
      <Dropdown.Container position="center">
        <Dropdown.Trigger asInput>{dateformat}</Dropdown.Trigger>
        <Dropdown.List fullWidth>{dateFormatsList}</Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default DateFormatDropdown;
