// import dependencies
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

// import local files
import useContextStore from '../../../context';
import useNotificationForm from '../../../hooks/useNotificationForm';
import NotificationsTemplates from '../../../../shared/notifications';
import NotificationModalPayload from '../../modal/notification/payload';
import NotificationModalType from '../../modal/notification/dropdown/type';
import * as NotificationPlatformContent from './platform';

const NotificationContent = () => {
  const {
    notificationStore: { addNotification, activeNotification: notification },
  } = useContextStore();

  const { inputs, errors, handleInput, handleSubmit } = useNotificationForm(
    notification,
    true
  );
  const { t } = useTranslation();

  const message =
    NotificationsTemplates[notification.platform][inputs.messageType];
  const Content = NotificationPlatformContent[notification.platform];

  return (
    <div className="notication-container">
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

      <label className="input-label">{t('notification.input.payload')}</label>
      <NotificationModalPayload message={message} />
    </div>
  );
};

export default observer(NotificationContent);
