// import dependencies
import { Button, Modal } from '@lunalytics/ui';

interface StatusDeleteModalProps {
  closeModal: () => void;
  deleteStatusPage: () => void;
  title: string;
}

const StatusDeleteModal = ({
  closeModal,
  deleteStatusPage,
  title,
}: StatusDeleteModalProps) => {
  return (
    <Modal
      title="Are you absolutely sure?"
      actions={
        <>
          <Button onClick={closeModal} color="gray">
            Close
          </Button>
          <Button
            color="green"
            variant="flat"
            id="status-page-delete-button"
            onClick={() => {
              deleteStatusPage();
              closeModal();
            }}
          >
            Delete
          </Button>
        </>
      }
      size="xs"
    >
      By continuing you will be deleting{' '}
      <span style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
        {title} status page
      </span>{' '}
      , along with all data related with this status page.{' '}
      <span style={{ fontWeight: '600' }}>This action cannot be undone.</span>
    </Modal>
  );
};

StatusDeleteModal.displayName = 'StatusDeleteModal';

export default StatusDeleteModal;
