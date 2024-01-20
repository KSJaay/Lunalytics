import AlertBox from '../../ui/modal/alert';

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

export default MonitorAlertBox;
