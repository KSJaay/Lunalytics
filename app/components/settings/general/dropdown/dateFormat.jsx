import timeformats from '../../../../constant/dateformats.json';
import useDropdown from '../../../../hooks/useDropdown';
import useLocalStorageContext from '../../../../hooks/useLocalstorage';
import Dropdown from '../../../ui/dropdown/index';

const DateFormatDropdown = () => {
  const { dateformat, setDateformat } = useLocalStorageContext();

  const { dropdownIsOpen, toggleDropdown } = useDropdown(false);

  const dateFormatsList = timeformats.map((format) => (
    <Dropdown.Item
      key={format}
      onClick={() => setDateformat(format)}
      showDot
      isSelected={dateformat === format}
    >
      {format}
    </Dropdown.Item>
  ));

  return (
    <>
      <label className="text-input-label">Date Format</label>
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
          {dateformat}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {dateFormatsList}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

export default DateFormatDropdown;
