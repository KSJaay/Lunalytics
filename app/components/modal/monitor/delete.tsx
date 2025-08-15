// import dependencies
import PropTypes from 'prop-types';
import { Button, Modal } from '@lunalytics/ui';

const MonitorModal = ({ name = 'Lunalytics', handleClose, handleConfirm }) => {
  return (
    <Modal
      title="Are you absolutely sure?"
      actions={
        <>
          <Button
            color="gray"
            onClick={handleClose}
            id="monitor-delete-cancel-button"
          >
            Cancel
          </Button>
          <Button
            color="red"
            variant="flat"
            onClick={handleConfirm}
            id="monitor-delete-confirm-button"
          >
            Confirm
          </Button>
        </>
      }
      size="xs"
    >
      By continuing you will be deleting{' '}
      <span style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
        {name} monitor
      </span>{' '}
      and all the data related with this monitor.{' '}
      <span style={{ fontWeight: '600' }}>This action cannot be undone.</span>
    </Modal>
  );
};

MonitorModal.displayName = 'MonitorModal';

MonitorModal.propTypes = {
  name: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default MonitorModal;
