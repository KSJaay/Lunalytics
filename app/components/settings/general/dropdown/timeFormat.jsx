import useDropdown from '../../../../hooks/useDropdown';
import useLocalStorageContext from '../../../../hooks/useLocalstorage';
import Dropdown from '../../../ui/dropdown/index';

const times = {
  'HH:mm:ss': '23:59:59',
  'HH:mm': '23:59',
  'hh:mm': '11:59',
  'hh:mm A': '11:59 PM',
};

const TimeFormatDropdown = () => {
  const { timeformat, setTimeformat } = useLocalStorageContext();
  const { dropdownIsOpen, toggleDropdown } = useDropdown(false);

  const timeFormatList = [
    { name: '23:59:59', value: 'HH:mm:ss' },
    { name: '23:59', value: 'HH:mm' },
    { name: '11:59', value: 'hh:mm' },
    { name: '11:59 PM', value: 'hh:mm A' },
  ].map((time) => (
    <Dropdown.Item
      key={time.value}
      onClick={() => setTimeformat(time.value)}
      showDot
      isSelected={time.value === timeformat}
    >
      {time.name}
    </Dropdown.Item>
  ));

  return (
    <>
      <label className="text-input-label">Time Format</label>
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
          {times[timeformat]}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {timeFormatList}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default TimeFormatDropdown;
