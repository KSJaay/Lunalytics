// import dependencies
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';
import { useTranslation } from 'react-i18next';

const NotificationDeleteModal = ({ name, handleClose, handleConfirm }) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal.Title>Are you absolutely sure?</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        {t('notification.delete_modal_start')}{' '}
        <span style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
          {name} {t('common.notification')}
        </span>{' '}
        {t('notification.delete_modal_middle')}{' '}
        <span style={{ fontWeight: '600' }}>
          {t('notification.delete_modal_end')}
        </span>
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={handleClose}>{t('common.cancel')}</Modal.Button>
        <Modal.Button
          color="red"
          onClick={handleConfirm}
          id="notification-delete-confirm"
        >
          {t('common.confirm')}
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
