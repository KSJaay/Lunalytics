// import dependencies
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';

const MonitorModal = ({ monitorId, handleClose, handleConfirm }) => {
  return (
    <>
      <Modal.Title>Are you absolutely sure?</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        By continuing you will be deleting{' '}
        <span style={{ fontWeight: '600' }}>{monitorId} monitor</span> and all
        the data related with this monitor.{' '}
        <span style={{ fontWeight: '600' }}>This action cannot be undone.</span>
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={handleClose} id="monitor-delete-cancel-button">
          Cancel
        </Modal.Button>
        <Modal.Button
          color="red"
          onClick={handleConfirm}
          id="monitor-delete-confirm-button"
        >
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

MonitorModal.displayName = 'MonitorModal';

MonitorModal.propTypes = {
  monitorId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default MonitorModal;
