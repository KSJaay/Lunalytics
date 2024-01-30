import './styles.scss';

// import local files
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../ui/dropdown';
import Button from '../../ui/button';

// import icons
import HiStatusOffline from '../../icons/HiStatusOffline';
import HiStatusOnline from '../../icons/HiStatusOnline';
import PiListFill from '../../icons/PiListFill';
import useLocalStorageContext from '../../../hooks/useLocalstorage';

const statusOptions = [
  {
    text: 'All',
    id: 'all',
    icon: <PiListFill width={20} height={20} />,
  },
  {
    text: 'Up',
    id: 'up',
    icon: <HiStatusOnline width={20} height={20} />,
  },
  {
    text: 'Down',
    id: 'down',
    icon: <HiStatusOffline width={20} height={20} />,
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
    >
      <Dropdown.Trigger isOpen={dropdownIsOpen} toggleDropdown={toggleDropdown}>
        <Button iconLeft={<HiStatusOnline width={20} height={20} />}>
          Status
        </Button>
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>{dropdownItems}</Dropdown.List>
    </Dropdown.Container>
  );
};

export default MenuStatusDropdown;
