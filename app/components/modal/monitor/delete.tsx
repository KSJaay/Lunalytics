// import dependencies
import { Button, Modal } from '@lunalytics/ui';

interface ModalProps {
  name?: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

const MonitorModal = ({
  name = 'Lunalytics',
  handleClose,
  handleConfirm,
}: ModalProps) => {
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

export default MonitorModal;
