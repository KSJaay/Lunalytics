// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// import local files
import MonitorModal from './modal';
import Dropdown from '../../ui/dropdown/index';
import useContextStore from '../../../context';
import { createGetRequest } from '../../../services/axios';

// import icons
import FaEllipsisVertical from '../../icons/faEllipsisVertical';

const MonitorOptions = ({ monitorId }) => {
  const {
    globalStore: { removeMonitor, getMonitor },
    modalStore: { openModal, closeModal },
    userStore: { user },
  } = useContextStore();

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
    <Dropdown.Container position="center">
      <Dropdown.Trigger>
        <FaEllipsisVertical width={20} height={20} />
      </Dropdown.Trigger>
      <Dropdown.List>
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
