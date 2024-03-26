// import local files
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../ui/dropdown';
import Button from '../../ui/button';

// import icons
import BsTable from '../../icons/bsTable';
import IoGrid from '../../icons/ioGrid';
import PiListFill from '../../icons/piListFill';
import FiLayout from '../../icons/fiLayout';
import useLocalStorageContext from '../../../hooks/useLocalstorage';

const views = [
  {
    text: 'Cards',
    id: 'cards',
    icon: <IoGrid width={20} height={20} />,
  },
  {
    text: 'List',
    id: 'list',
    icon: <BsTable width={20} height={20} />,
  },
  {
    text: 'Compact',
    id: 'compact',
    icon: <PiListFill width={20} height={20} />,
  },
];

const MenuLayoutDropdown = () => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const { layout, setLayout } = useLocalStorageContext();

  const dropdownItems = views.map((view) => (
    <Dropdown.Item
      key={view.id}
      onClick={() => setLayout(view.id)}
      showDot
      isSelected={layout === view.id}
      dotColor="primary"
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
      id="home-menu-layout"
    >
      <Dropdown.Trigger isOpen={dropdownIsOpen} toggleDropdown={toggleDropdown}>
        <Button iconLeft={<FiLayout width={20} height={20} />}>Layout</Button>
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>{dropdownItems}</Dropdown.List>
    </Dropdown.Container>
  );
};

export default MenuLayoutDropdown;
