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
import ActionBar from '../../ui/actionBar';
import { useMemo } from 'react';
import { Button } from '@lunalytics/ui';

const NotificationContent = () => {
  const {
    notificationStore: { addNotification, activeNotification: notification },
  } = useContextStore();

  const { inputs, errors, handleInput, handleSubmit } = useNotificationForm(
    notification,
    true
  );
  const { t } = useTranslation();

  const showSaveActionBar = useMemo(() => {
    return JSON.stringify(notification) !== JSON.stringify(inputs);
  }, [JSON.stringify(notification), JSON.stringify(inputs)]);

  const message =
    NotificationsTemplates[notification.platform][inputs.messageType];
  const Content = NotificationPlatformContent[notification.platform];

  return (
    <div className="notication-container">
      <Content inputs={inputs} errors={errors} handleInput={handleInput} />

      <NotificationModalType
        messageType={inputs.messageType}
        setMessageType={(value) => {
          handleInput(value);
        }}
      />

      <label className="input-label">{t('notification.input.payload')}</label>
      <NotificationModalPayload message={message} />

      <ActionBar position="bottom" variant="floating" show={showSaveActionBar}>
        <div className="status-action-bar-container">
          <div className="title">
            Found some changes! Please save or cancel.
          </div>
          <div className="buttons">
            <Button
              color="red"
              variant="flat"
              onClick={() => {
                handleInput({ key: 'reset', value: notification });
              }}
            >
              Cancel
            </Button>
            <Button
              color="green"
              variant="flat"
              onClick={() => {
                handleSubmit(addNotification);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </ActionBar>
    </div>
  );
};

export default observer(NotificationContent);
