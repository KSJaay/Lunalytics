import './menu.scss';

// import dependencies
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import Button from '../ui/button';
import useContextStore from '../../context';
import MonitorModal from '../modal/monitor/delete';
import { createGetRequest } from '../../services/axios';
import MonitorConfigureModal from '../modal/monitor/configure';
import { FaTrashCan, MdEdit } from '../icons';

const MonitorMenu = ({ name = 'Unknown', monitorId }) => {
  const {
    modalStore: { openModal, closeModal },
    globalStore: { getMonitor, editMonitor, removeMonitor },
    userStore: { user },
  } = useContextStore();
  const navigate = useNavigate();

  const isEditor = user.permission <= 3;

  const handleConfirm = async () => {
    await createGetRequest('/api/monitor/delete', {
      monitorId,
    });

    removeMonitor(monitorId);

    toast.success('Monitor deleted successfully!');

    closeModal();
    navigate('/');
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
      <div className="monitor-view-menu-name" id="monitor-view-menu-name">
        {name}
      </div>
      {/* <Button iconLeft={<FaTrashCan style={{ width: '20px', height: '20px' }} />}>Pause</Button> */}
      {/* <Button iconLeft={<FaTrashCan style={{ width: '20px', height: '20px' }} />}>Duplicate</Button> */}
      {isEditor && (
        <>
          <Button
            id="monitor-edit-button"
            iconLeft={<MdEdit style={{ width: '20px', height: '20px' }} />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            id="monitor-delete-button"
            iconLeft={<FaTrashCan style={{ width: '20px', height: '20px' }} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

MonitorMenu.displayName = 'MonitorMenu';

MonitorMenu.propTypes = {
  monitorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default observer(MonitorMenu);
