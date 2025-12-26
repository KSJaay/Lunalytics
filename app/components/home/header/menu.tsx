// import dependencies
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { LuEllipsis } from 'react-icons/lu';

// import local files
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';
import useContextStore from '../../../context';
import useMonitorOptions from '../../../hooks/useMonitorOptions';

interface DropdownItemProps {
  id: string;
  text: string;
  icon?: React.ElementType;
  onClick: () => void;
}

const DropdownItem = ({ id, text, icon: Icon, onClick }: DropdownItemProps) => (
  <Dropdown.Item
    key={id}
    id={id}
    onClick={onClick}
    className="home-header-menu-list-item"
  >
    {Icon && <Icon />}
    {text}
  </Dropdown.Item>
);

const HomeMonitorHeaderMenu = () => {
  const {
    globalStore: {
      getMonitor,
      allMonitors,
      activeMonitor,
      addMonitor,
      editMonitor,
      removeMonitor,
    },
    modalStore: { closeModal, openModal },
  } = useContextStore();

  const { toggleDropdown, dropdownIsOpen } = useDropdown(true);

  const monitor = useMemo(() => {
    if (!activeMonitor) return null;

    return getMonitor(activeMonitor.monitorId);
  }, [activeMonitor, getMonitor, allMonitors]);

  const { options } = useMonitorOptions(
    DropdownItem,
    monitor,
    addMonitor,
    editMonitor,
    removeMonitor,
    closeModal,
    openModal
  );

  return (
    <div onClick={toggleDropdown} id="monitor-options-button">
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        position="center"
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          color="transparent"
        >
          <LuEllipsis size={20} onClick={toggleDropdown} />
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen}>
          {options.map((option) => option.text)}
        </Dropdown.List>
      </Dropdown.Container>
    </div>
  );
};

export default observer(HomeMonitorHeaderMenu);
