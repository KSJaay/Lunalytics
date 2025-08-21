// import dependencies
import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// import local files
import SwitchWithText from '../../../ui/switch';
import type { NotificationSlack } from '../../../../types/notifications';

const NotificationSlackContent = ({
  inputs,
  errors,
  handleInput,
}: {
  inputs: NotificationSlack;
  errors: Partial<Record<keyof NotificationSlack, string>>;
  handleInput: (
    input: Partial<Record<keyof NotificationSlack, string>>
  ) => void;
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({ key: 'friendlyName', value: e.target.value });
          }}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          title={t('notification.input.webhook_url')}
          placeholder="https://hooks.slack.com/services/..."
          id="webhook-url"
          error={errors?.token}
          value={inputs.token || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({ key: 'token', value: e.target.value });
          }}
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
        />

        <Input
          title={t('notification.input.webhook_username')}
          placeholder="Lunalytics"
          id="webhook-username"
          error={errors?.username}
          value={inputs.data.username || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, username: e.target.value },
            });
          }}
        />

        <Input
          title={t('notification.input.text_message')}
          placeholder="Alert @everyone"
          id="text-messsage"
          error={errors?.textMessage}
          value={inputs.data.textMessage || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, textMessage: e.target.value },
            });
          }}
        />
      </div>

      <Input
        title={t('notification.input.channel')}
        placeholder="lunalytics-alerts"
        id="channel-name"
        error={errors?.channel}
        value={inputs.data.channel || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, channel: e.target.value },
          });
        }}
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
    </>
  );
};

export default NotificationSlackContent;
