// import node_modules
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Dropdown from '../../ui/dropdown/index';
import ContextStore from '../../../context';
import FaEllipsisVertical from '../../icons/faEllipsisVertical';
import { createGetRequest } from '../../../services/axios';
import MonitorAlertBox from './alertBox';

const MonitorOptions = ({ monitorId }) => {
  const {
    globalStore: { removeMonitor, getMonitor },
    alertBoxStore: { openAlertBox, closeAlertBox },
  } = useContext(ContextStore);

  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/monitor/${monitorId}`);
  };

  const handleConfirm = async () => {
    await createGetRequest('/monitor/delete', {
      monitorId,
    });

    removeMonitor(monitorId);

    toast.success('Monitor deleted successfully!');

    closeAlertBox();
  };

  const handleDelete = () => {
    const monitor = getMonitor(monitorId);

    openAlertBox(
      <MonitorAlertBox
        monitorId={monitor.name}
        handleConfirm={handleConfirm}
        handleClose={closeAlertBox}
      />
    );
  };

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

export default observer(MonitorOptions);
