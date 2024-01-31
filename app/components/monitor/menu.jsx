import './menu.scss';

// import dependencies
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import Button from '../ui/button';
import FaTrash from '../icons/faTrash';
import MdEdit from '../icons/mdEdit';
import useContextStore from '../../context';
import MonitorModal from '../modal/monitor/delete';
import { createGetRequest } from '../../services/axios';

const MonitorMenu = ({ name = 'Unknown', monitorId }) => {
  const {
    modalStore: { openModal, closeModal },
    globalStore: { removeMonitor },
  } = useContextStore();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    await createGetRequest('/api/monitor/delete', {
      monitorId,
    });

    removeMonitor(monitorId);

    toast.success('Monitor deleted successfully!');

    closeModal();
    navigate('/');
  };

  const handleDelete = () => {
    openModal(
      <MonitorModal
        monitorId={name}
        handleConfirm={handleConfirm}
        handleClose={closeModal}
      />
    );
  };

  return (
    <div className="monitor-view-menu-container">
      <div className="monitor-view-menu-name">{name}</div>
      {/* <Button iconLeft={<FaTrash width={20} height={20} />}>Pause</Button> */}
      {/* <Button iconLeft={<FaTrash width={20} height={20} />}>Duplicate</Button> */}
      <Button
        iconLeft={<MdEdit width={20} height={20} />}
        onClick={() => navigate(`/monitor/edit?monitorId=${monitorId}`)}
      >
        Edit
      </Button>
      <Button
        iconLeft={<FaTrash width={20} height={20} />}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};

MonitorMenu.displayName = 'MonitorMenu';

MonitorMenu.propTypes = {
  monitorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default observer(MonitorMenu);
