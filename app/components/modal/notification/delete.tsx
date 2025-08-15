// import dependencies
import PropTypes from 'prop-types';
import { Button, Modal } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';

const NotificationDeleteModal = ({ name, handleClose, handleConfirm }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Are you absolutely sure?"
      actions={
        <>
          <Button color="gray" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            color="red"
            variant="flat"
            onClick={handleConfirm}
            id="notification-delete-confirm"
          >
            {t('common.confirm')}
          </Button>
        </>
      }
      size="xs"
    >
      {t('notification.delete_modal_start')}{' '}
      <span style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
        {name} {t('common.notification')}
      </span>{' '}
      {t('notification.delete_modal_middle')}{' '}
      <span style={{ fontWeight: '600' }}>
        {t('notification.delete_modal_end')}
      </span>
    </Modal>
  );
};

NotificationDeleteModal.displayName = 'NotificationDeleteModal';

NotificationDeleteModal.propTypes = {
  name: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default NotificationDeleteModal;
