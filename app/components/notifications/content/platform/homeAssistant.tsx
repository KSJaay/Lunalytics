import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

import SwitchWithText from '../../../ui/switch';

const NotificationHomeAssistantContent = ({
  inputs,
  errors,
  handleInput,
  handleUpdate,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="notification-content-container">
        <Input
          title={t('notification.input.friendly_name')}
          placeholder="Lunalytics"
          id="friendly-name"
          error={errors?.friendlyName}
          value={inputs.friendlyName || ''}
          onChange={(e) => {
            handleInput({ key: 'friendlyName', value: e.target.value });
          }}
          onBlur={() => handleUpdate()}
        />

        <Input
          title={t('notification.input.home_assistant_url')}
          placeholder="https://www.home-assistant.io/"
          id="home-assistant-url"
          error={errors?.homeAssistantUrl}
          value={inputs.data?.homeAssistantUrl || ''}
          onChange={(e) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, homeAssistantUrl: e.target.value },
            });
          }}
          onBlur={() => handleUpdate?.()}
        />

        <Input
          title={t('notification.input.notification_service')}
          placeholder="mobile_app_<device_name>"
          id="home-assistant-notification-service"
          isRequired
          error={errors?.homeAssistantNotificationService}
          value={inputs.data?.homeAssistantNotificationService || ''}
          onChange={(e) => {
            handleInput({
              key: 'data',
              value: {
                ...inputs.data,
                homeAssistantNotificationService: e.target.value,
              },
            });
          }}
          onBlur={() => handleUpdate?.()}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          title={t('notification.input.long_lived')}
          id="home-assistant-access-token"
          error={errors?.token}
          value={inputs.token || ''}
          iconRight={
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="notification-content-icon"
            >
              {showPassword ? (
                <IoMdEyeOff style={{ width: '25px', height: '25px' }} />
              ) : (
                <IoMdEye style={{ width: '25px', height: '25px' }} />
              )}
            </div>
          }
          onChange={(e) => {
            handleInput({ key: 'token', value: e.target.value });
          }}
          onBlur={() => handleUpdate?.()}
        />
      </div>

      <div style={{ paddingTop: '1rem' }}>
        <SwitchWithText
          label={t('notification.input.enabled_title')}
          shortDescription={t('notification.input.enabled_description')}
          checked={inputs.isEnabled}
          onChange={(e) => {
            handleInput({ key: 'isEnabled', value: e.target.checked });
            handleUpdate();
          }}
        />
      </div>
    </>
  );
};

export default NotificationHomeAssistantContent;
