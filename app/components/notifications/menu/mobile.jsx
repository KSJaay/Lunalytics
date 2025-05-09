// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import useDropdown from '../../../hooks/useDropdown';
import { FaEllipsisVertical } from '../../icons';
import Dropdown from '../../ui/dropdown';
import useContextStore from '../../../context';
import MonitorConfigureModal from '../../modal/monitor/configure';

const HomeMenuMobile = ({ handleReset }) => {
  const {
    modalStore: { openModal, closeModal },
    globalStore: { addMonitor },
  } = useContextStore();

  const { toggleDropdown, dropdownIsOpen } = useDropdown(true);
  return (
    <Dropdown.Container isOpen={dropdownIsOpen} toggleDropdown={toggleDropdown}>
      <Dropdown.Trigger
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        style={{ height: '45px' }}
      >
        <FaEllipsisVertical style={{ width: '24px', height: '24px' }} />
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>
        <Dropdown.Item
          onClick={() =>
            openModal(
              <MonitorConfigureModal
                closeModal={closeModal}
                handleMonitorSubmit={addMonitor}
              />,
              false
            )
          }
        >
          Add Monitor
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            handleReset();
            toggleDropdown();
          }}
        >
          Reset
        </Dropdown.Item>
      </Dropdown.List>
    </Dropdown.Container>
  );
};

HomeMenuMobile.displayName = 'HomeMenuMobile';

HomeMenuMobile.propTypes = {
  handleReset: PropTypes.func.isRequired,
};

export default observer(HomeMenuMobile);
