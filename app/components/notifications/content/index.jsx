// import dependencies
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../../context';
import useNotificationForm from '../../../hooks/useNotificationForm';
import NotificationsTemplates from '../../../../shared/notifications';
import NotificationModalPayload from '../../modal/notification/payload';
import NotificationModalType from '../../modal/notification/dropdown/type';
import * as NotificationPlatformContent from './platform';

const NotificationContent = ({ notificationId }) => {
  const {
    notificationStore: { addNotification, getNotifciationById },
  } = useContextStore();

  const notification = getNotifciationById(notificationId);

  const { inputs, errors, handleInput, handleSubmit } = useNotificationForm(
    notification,
    true
  );

  const message =
    NotificationsTemplates[notification.platform][inputs.messageType];
  const Content = NotificationPlatformContent[notification.platform];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0 1rem 1rem 1rem',
      }}
    >
      <Content
        inputs={inputs}
        errors={errors}
        handleInput={handleInput}
        handleUpdate={() => handleSubmit(addNotification)}
      />

      <NotificationModalType
        messageType={inputs.messageType}
        setMessageType={(value) => {
          handleInput(value);
          handleSubmit(addNotification);
        }}
      />

      <label className="input-label">Payload</label>
      <NotificationModalPayload message={message} />
    </div>
  );
};

export default observer(NotificationContent);
