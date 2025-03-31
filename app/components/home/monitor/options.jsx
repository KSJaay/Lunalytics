// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// import local files
import MonitorModal from '../../modal/monitor/delete';
import Dropdown from '../../ui/dropdown/index';
import useContextStore from '../../../context';
import useDropdown from '../../../hooks/useDropdown';
import { createGetRequest } from '../../../services/axios';
import MonitorConfigureModal from '../../modal/monitor/configure';
import { FaEllipsisVertical } from '../../icons';
import Role from '../../../../shared/permissions/role';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';

const MonitorOptions = ({ monitorId }) => {
  const {
    globalStore: { removeMonitor, editMonitor, getMonitor },
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

  const handleEdit = () => {
    const monitor = getMonitor(monitorId);

    openModal(
      <MonitorConfigureModal
        monitor={monitor}
        closeModal={closeModal}
        handleMonitorSubmit={editMonitor}
        isEdit
      />,
      false
    );
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

  const canManageMonitors = new Role('user', user.permission).hasPermission(
    PermissionsBits.MANAGE_MONITORS
  );

  if (!canManageMonitors) return null;

  return (
    <Dropdown.Container
      position="center"
      isOpen={dropdownIsOpen}
      toggleDropdown={toggleDropdown}
    >
      <Dropdown.Trigger toggleDropdown={toggleDropdown} isOpen={dropdownIsOpen}>
        <FaEllipsisVertical style={{ width: '20px', height: '20px' }} />
      </Dropdown.Trigger>
      <Dropdown.List isOpen={dropdownIsOpen}>
        <Dropdown.Item onClick={handleOpen}>Open</Dropdown.Item>
        <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
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
