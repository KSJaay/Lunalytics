// import local files
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../ui/dropdown';
import Button from '../../ui/button';
import { BsTable, IoGrid, FaBars, FiLayout } from '../../icons';
import useLocalStorageContext from '../../../hooks/useLocalstorage';

const views = [
  {
    text: 'Cards',
    id: 'cards',
    icon: <IoGrid style={{ width: '20px', height: '20px' }} />,
  },
  {
    text: 'List',
    id: 'list',
    icon: <BsTable style={{ width: '20px', height: '20px' }} />,
  },
  {
    text: 'Compact',
    id: 'compact',
    icon: <FaBars style={{ width: '20px', height: '20px' }} />,
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
      position="left"
      isOpen={dropdownIsOpen}
      toggleDropdown={toggleDropdown}
      id="home-menu-layout"
    >
      <Dropdown.Trigger isOpen={dropdownIsOpen} toggleDropdown={toggleDropdown}>
        <Button
          iconLeft={<FiLayout style={{ width: '20px', height: '20px' }} />}
        >
          Layout
        </Button>
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>{dropdownItems}</Dropdown.List>
    </Dropdown.Container>
  );
};

export default MenuLayoutDropdown;
