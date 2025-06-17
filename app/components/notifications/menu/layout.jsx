import { Button } from '@lunalytics/ui';

// import local files
import useDropdown from '../../../hooks/useDropdown';
import Dropdown from '../../ui/dropdown';

// import icons
import { BsTable, IoGrid, FiLayout } from '../../icons';
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
];

// Instead of using the dropdown, we can use a button to toggle the view as we only have 2 options

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
        <Button
          iconLeft={<FiLayout style={{ width: '20px', height: '20px' }} />}
          color="gray"
        >
          Layout
        </Button>
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>{dropdownItems}</Dropdown.List>
    </Dropdown.Container>
  );
};

export default MenuLayoutDropdown;
