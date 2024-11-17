// import local files
import useDropdown from '../../../../hooks/useDropdown';
import Dropdown from '../../../ui/dropdown';
import useLocalStorageContext from '../../../../hooks/useLocalstorage';

import { HiStatusOffline, HiStatusOnline, FaBars } from '../../../icons';

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

const HomeMobileMenuStatus = () => {
  const { toggleDropdown, dropdownIsOpen } = useDropdown(true);

  const { status, setStatus } = useLocalStorageContext();

  const dropdownItems = statusOptions.map((view) => (
    <Dropdown.Item
      key={view.id}
      onClick={() => {
        setStatus(view.id);
        toggleDropdown();
      }}
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
      <Dropdown.Trigger
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        asInput
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
        {dropdownItems}
      </Dropdown.List>
    </Dropdown.Container>
  );
};

HomeMobileMenuStatus.displayName = 'HomeMobileMenuStatus';

HomeMobileMenuStatus.propTypes = {};

export default HomeMobileMenuStatus;
