import { useMemo } from 'react';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import ActionBar from '../../ui/actionBar';
import SwitchWithText from '../../ui/switch';
import useContextStore from '../../../context';
import useNotificationForm from '../../../hooks/useNotificationForm';
import NotificationsTemplates from '../../../../shared/notifications';
import NotificationModalPayload from '../../modal/notification/payload';
import NotificationModalType from '../../modal/notification/dropdown/type';
import * as NotificationPlatformContent from '../../../../shared/notifications/layout';
import NotificationRenderer from './renderer';

const NotificationRender = ({ isEdit = false }: { isEdit: boolean }) => {
  const {
    notificationStore: { addNotification, activeNotification: notification },
  } = useContextStore();

  const { t } = useTranslation();

  const { inputs, errors, handleInput, handleSubmit } = useNotificationForm(
    notification,
    true
  );

  const showSaveActionBar = useMemo(() => {
    return JSON.stringify(notification) !== JSON.stringify(inputs);
  }, [JSON.stringify(notification), JSON.stringify(inputs)]);

  const components =
    notification && NotificationPlatformContent[notification?.platform];

  if (!components) {
    return null;
  }

  const message =
    NotificationsTemplates[notification.platform][inputs.messageType];

  return (
    <div className="notification-container">
      <NotificationRenderer
        inputs={inputs}
        errors={errors}
        handleInput={handleInput}
        isEdit={isEdit}
      />

      <div style={{ paddingTop: '1rem' }}>
        <SwitchWithText
          label={t('notification.input.enabled_title')}
          shortDescription={t('notification.input.enabled_description')}
          checked={inputs.isEnabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({ key: 'isEnabled', value: e.target.checked });
          }}
        />
      </div>

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

export default observer(NotificationRender);
