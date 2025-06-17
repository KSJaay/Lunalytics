import { Button } from '@lunalytics/ui';

// import local files
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../ui/dropdown';
import { HiStatusOffline, HiStatusOnline, FaBars } from '../../icons';
import useLocalStorageContext from '../../../hooks/useLocalstorage';

const statusOptions = [
  {
    text: 'All',
    id: 'all',
    icon: <FaBars style={{ width: '20px', height: '20px' }} />,
  },
  {
    text: 'Up',
    id: 'up',
    icon: <HiStatusOnline style={{ width: '20px', height: '20px' }} />,
  },
  {
    text: 'Down',
    id: 'down',
    icon: <HiStatusOffline style={{ width: '20px', height: '20px' }} />,
  },
];

const MenuStatusDropdown = () => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown(false, 'all');

  const { status, setStatus } = useLocalStorageContext();

  const dropdownItems = statusOptions.map((view) => (
    <Dropdown.Item
      key={view.id}
      onClick={() => setStatus(view.id)}
      showDot
      isSelected={status === view.id}
    >
      <div className="layout-option">
        {view.icon}
        {view.text}
      </div>
    </Dropdown.Item>
  ));

  return (
    <Dropdown.Container
      position="center"
      isOpen={dropdownIsOpen}
      toggleDropdown={toggleDropdown}
      id="home-menu-status"
    >
      <Dropdown.Trigger isOpen={dropdownIsOpen} toggleDropdown={toggleDropdown}>
        <Button
          color="gray"
          iconLeft={
            <HiStatusOnline style={{ width: '20px', height: '20px' }} />
          }
        >
          Status
        </Button>
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>{dropdownItems}</Dropdown.List>
    </Dropdown.Container>
  );
};

export default MenuStatusDropdown;
