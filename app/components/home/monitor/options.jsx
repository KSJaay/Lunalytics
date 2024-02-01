// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// import local files
import MonitorModal from '../../modal/monitor/delete';
import Dropdown from '../../ui/dropdown/index';
import useContextStore from '../../../context';
import { createGetRequest } from '../../../services/axios';

// import icons
import FaEllipsisVertical from '../../icons/faEllipsisVertical';
import useDropdown from '../../../hooks/useDropdown';

const MonitorOptions = ({ monitorId }) => {
  const {
    globalStore: { removeMonitor, getMonitor },
    modalStore: { openModal, closeModal },
    userStore: { user },
  } = useContextStore();

  const { dropdownIsOpen, toggleDropdown } = useDropdown(true);

  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/monitor/${monitorId}`);
  };

  const handleConfirm = async () => {
    await createGetRequest('/api/monitor/delete', {
      monitorId,
    });

    removeMonitor(monitorId);

    toast.success('Monitor deleted successfully!');

    closeModal();
  };

  const handleDelete = () => {
    const monitor = getMonitor(monitorId);

    openModal(
      <MonitorModal
        monitorId={monitor.name}
        handleConfirm={handleConfirm}
        handleClose={closeModal}
      />
    );
  };

  if (!user.canEdit) return null;

  return (
    <Dropdown.Container
      position="center"
      isOpen={dropdownIsOpen}
      toggleDropdown={toggleDropdown}
    >
      <Dropdown.Trigger toggleDropdown={toggleDropdown} isOpen={dropdownIsOpen}>
        <FaEllipsisVertical width={20} height={20} />
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>
        <Dropdown.Item onClick={handleOpen}>Open</Dropdown.Item>
        <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
      </Dropdown.List>
    </Dropdown.Container>
  );
};

MonitorOptions.displayName = 'MonitorOptions';

MonitorOptions.propTypes = {
  monitorId: PropTypes.string.isRequired,
};

export default observer(MonitorOptions);
