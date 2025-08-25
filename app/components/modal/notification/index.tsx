// import dependencies
import { useEffect } from 'react';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import NotificationModalType from './dropdown/type';
import NotificationModalPlatform from './dropdown/platform';
import NotificationsTemplates from '../../../../shared/notifications';
import useNotificationForm from '../../../hooks/useNotificationForm';
import NotificationModalPayload from './payload';
import * as inputForPlatform from './platform';
import type { NotificationProps } from '../../../types/notifications';

interface NotificationModalProps {
  values?: NotificationProps;
  isEdit?: boolean;
  closeModal: () => void;
  addNotification: (notification: NotificationProps) => void;
}

const NotificationModal = ({
  values,
  isEdit,
  closeModal,
  addNotification,
}: NotificationModalProps) => {
  const { inputs, errors, handleInput, handleSubmit } = useNotificationForm(
    values,
    isEdit,
    closeModal
  );

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event?.key === 'Escape' || event?.key === 'Esc') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  type Platform = keyof typeof NotificationsTemplates;
  type MessageType = keyof (typeof NotificationsTemplates)[Platform];

  const platform = inputs.platform as Platform;
  const messageType = inputs.messageType as MessageType;

  const message = NotificationsTemplates[platform]?.[messageType] || 'basic';

  const PlatformInputs = inputForPlatform[
    inputs.platform as Platform
  ] as React.ComponentType<any>;

  return (
    <Modal
      title={isEdit ? 'Edit Notification' : 'Add Notification'}
      actions={
        <>
          <Button color={'red'} variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            color="green"
            variant="flat"
            onClick={() => handleSubmit(addNotification)}
            id="notification-create-button"
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </>
      }
      onClose={closeModal}
      size="xl"
    >
      {errors['general'] && (
        <div className="input-error-general">{errors['general']}</div>
      )}

      <NotificationModalPlatform
        isEdit={isEdit}
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
    </Modal>
  );
};

NotificationModal.displayName = 'NotificationModal';

export default NotificationModal;
