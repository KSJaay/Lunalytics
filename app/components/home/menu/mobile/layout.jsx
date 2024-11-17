// import dependencies
import { observer } from 'mobx-react-lite';

// import local files
import useDropdown from '../../../../hooks/useDropdown';
import Dropdown from '../../../ui/dropdown';
import useLocalStorageContext from '../../../../hooks/useLocalstorage';
import { FaBars, IoGrid } from '../../../icons';

const views = [
  {
    text: 'Cards',
    id: 'cards',
    icon: <IoGrid style={{ width: '20px', height: '20px' }} />,
  },
  {
    text: 'Compact',
    id: 'compact',
    icon: <FaBars style={{ width: '20px', height: '20px' }} />,
  },
];

const HomeMobileMenuLayout = () => {
  const { toggleDropdown, dropdownIsOpen } = useDropdown(true);

  const { layout, setLayout } = useLocalStorageContext();

  const dropdownItems = views.map((view) => (
    <Dropdown.Item
      key={view.id}
      onClick={() => {
        setLayout(view.id);
        toggleDropdown();
      }}
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
      <Dropdown.Trigger
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        asInput
      >
        {layout.charAt(0).toUpperCase() + layout.slice(1)}
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
        {dropdownItems}
      </Dropdown.List>
    </Dropdown.Container>
  );
};

HomeMobileMenuLayout.displayName = 'HomeMobileMenuLayout';

HomeMobileMenuLayout.propTypes = {};

export default observer(HomeMobileMenuLayout);
