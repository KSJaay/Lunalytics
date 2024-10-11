import './styles.scss';

// import dependencies
import { useEffect } from 'react';
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';
import NotificationModalType from './dropdown/type';
import NotificationModalPlatform from './dropdown/platform';
import NotificationsTemplates from '../../../../shared/notifications';
import useNotificationForm from '../../../hooks/useNotificationForm';
import NotificationModalPayload from './payload';
import * as inputForPlatform from './platform';

// Notification types
// - Up and running
// - Application went down
// - Warning (If the monitor goes down once it shows a warning, else throw error)

const NotificationModal = ({ values, isEdit, closeModal, addNotification }) => {
  const { inputs, errors, handleInput, handleSubmit } = useNotificationForm(
    values,
    isEdit,
    closeModal
  );

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event?.key === 'Escape' || event?.key === 'Esc') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const message = NotificationsTemplates[inputs.platform][inputs.messageType];

  const PlatformInputs = inputForPlatform[inputs.platform];

  return (
    <Modal.Container
      closeButton={closeModal}
      contentProps={{ style: { maxWidth: '650px', width: '100%' } }}
    >
      <Modal.Title style={{ textAlign: 'center' }}>
        {isEdit ? 'Edit Notification' : 'Add Notification'}
      </Modal.Title>

      {errors['general'] && (
        <div className="input-error-general">{errors['general']}</div>
      )}

      <Modal.Message>
        <NotificationModalPlatform
          isEdit={isEdit}
          values={inputs}
          setPlatform={handleInput}
          platform={inputs.platform}
        />
        <PlatformInputs
          values={inputs}
          errors={errors}
          handleInput={handleInput}
        />
        <NotificationModalType
          messageType={inputs.messageType}
          setMessageType={handleInput}
        />
        <label className="input-label">Payload</label>
        <NotificationModalPayload message={message} />
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button color={'red'} onClick={closeModal}>
          Cancel
        </Modal.Button>
        <Modal.Button
          color={'green'}
          onClick={() => handleSubmit(addNotification)}
        >
          {isEdit ? 'Update' : 'Create'}
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

NotificationModal.displayName = 'NotificationModal';

NotificationModal.propTypes = {
  isEdit: PropTypes.bool,
  values: PropTypes.object,
  closeModal: PropTypes.func,
  addNotification: PropTypes.func,
};

export default NotificationModal;
