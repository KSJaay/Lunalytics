// import dependencies
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import NotificationModalPayload from './payload';
import NotificationModalType from './dropdown/type';
import { createPostRequest } from '../../../services/axios';
import NotificationModalPlatform from './dropdown/platform';
import useNotificationForm from '../../../hooks/useNotificationForm';
import NotificationsTemplates from '../../../../shared/notifications';
import type { NotificationProps } from '../../../../shared/types/notifications';
import NotificationRenderer from '../../notifications/content/renderer';
import { EmailComponent } from '../../notifications/content';

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

  const testNotification = async () => {
    try {
      await createPostRequest('/api/notifications/test', inputs);
      toast.success('Test notification sent successfully');
      return;
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
      return;
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Notification' : 'Add Notification'}
      actions={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div>
            <Button color="gray" variant="flat" onClick={testNotification}>
              Test
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button color="red" variant="flat" onClick={closeModal}>
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
          </div>
        </div>
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

      <NotificationRenderer
        isEdit={false}
        inputs={inputs}
        errors={errors}
        handleInput={handleInput}
      />

      <NotificationModalType
        messageType={inputs.messageType}
        setMessageType={handleInput}
      />

      <label className="input-label">Payload</label>

      {inputs.platform !== 'Email' && (
        <NotificationModalPayload message={message} />
      )}

      {inputs.platform === 'Email' && (
        <EmailComponent type={inputs.messageType} />
      )}
    </Modal>
  );
};

NotificationModal.displayName = 'NotificationModal';

export default NotificationModal;
