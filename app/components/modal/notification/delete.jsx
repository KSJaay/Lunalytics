// import dependencies
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';

const NotificationDeleteModal = ({ name, handleClose, handleConfirm }) => {
  return (
    <>
      <Modal.Title>Are you absolutely sure?</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        By continuing you will be deleting{' '}
        <span style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
          {name} notification
        </span>{' '}
        from all linked monitors.{' '}
        <span style={{ fontWeight: '600' }}>This action cannot be undone.</span>
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={handleClose}>Cancel</Modal.Button>
        <Modal.Button
          color="red"
          onClick={handleConfirm}
          id="notification-delete-confirm"
        >
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

NotificationDeleteModal.displayName = 'NotificationDeleteModal';

NotificationDeleteModal.propTypes = {
  name: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default NotificationDeleteModal;
