import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

import SwitchWithText from '../../../ui/switch';

const NotificationHomeAssistantContent = ({
  inputs,
  errors,
  handleInput,
  handleUpdate,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 1rem',
        }}
      >
        <Input
          title="Friendly Name"
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
          title={'HomeAssistant URL'}
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
          title={'Notification Service'}
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
          title={'Long Lived Access Token'}
          id="home-assistant-access-token"
          error={errors?.token}
          value={inputs.token || ''}
          iconRight={
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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
          label="Enabled"
          shortDescription="Enable or disable the notification globally"
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
