// import dependencies
import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

// import local files
import SwitchWithText from '../../../ui/switch';

const NotificationDiscordContent = ({
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
          value={inputs.friendlyName}
          onChange={(e) => {
            handleInput({ key: 'friendlyName', value: e.target.value });
          }}
          onBlur={handleUpdate}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          id="token"
          title={t('notification.input.webhook_url')}
          error={errors.token}
          value={inputs.token}
          onChange={(event) =>
            handleInput({ key: 'token', value: event.target.value })
          }
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
          onBlur={handleUpdate}
        />

        <Input
          title={t('notification.input.webhook_username')}
          placeholder="Lunalytics"
          id="webhook-username"
          error={errors?.username}
          value={inputs.data.username}
          onChange={(e) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, username: e.target.value },
            });
          }}
          onBlur={handleUpdate}
        />

        <Input
          title={t('notification.input.text_message')}
          placeholder="Alert @everyone"
          id="text-messsage"
          error={errors?.textMessage}
          value={inputs.data.textMessage}
          onChange={(e) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, textMessage: e.target.value },
            });
          }}
          onBlur={handleUpdate}
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

export default NotificationDiscordContent;
