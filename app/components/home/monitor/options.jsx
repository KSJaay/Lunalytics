// import node_modules
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../ui/dropdown/index';
import ContextStore from '../../../context';
import AlertBox from '../../ui/modal/alert';
import FaEllipsisVertical from '../../icons/faEllipsisVertical';
import { createGetRequest } from '../../../services/axios';
import { toast } from 'sonner';

const MonitorAlertBox = ({ monitorId, handleClose, handleConfirm }) => {
  return (
    <>
      <AlertBox.Title>Are you absolutely sure?</AlertBox.Title>
      <AlertBox.Message style={{ width: '400px' }}>
        By continuing you will be deleting{' '}
        <span style={{ fontWeight: '600' }}>{monitorId} monitor</span> and all
        the data related with this monitor.{' '}
        <span style={{ fontWeight: '600' }}>This action cannot be undone.</span>
      </AlertBox.Message>
      <AlertBox.Actions>
        <AlertBox.Button onClick={handleClose}>Cancel</AlertBox.Button>
        <AlertBox.Button color="red" onClick={handleConfirm}>
          Confirm
        </AlertBox.Button>
      </AlertBox.Actions>
    </>
  );
};

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
