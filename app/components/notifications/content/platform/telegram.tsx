import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

import SwitchWithText from '../../../ui/switch';
import type { NotificationTelegram } from '../../../../types/notifications';

const NotificationDiscordContent = ({
  inputs,
  errors,
  handleInput,
}: {
  inputs: NotificationTelegram;
  errors: Partial<Record<keyof NotificationTelegram, string>>;
  handleInput: (
    input: Partial<Record<keyof NotificationTelegram, string>>
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
          id="bot-token"
          title={t('notification.input.bot_token')}
          placeholder={t('notification.input.bot_token')}
          error={errors.token}
          value={inputs.token || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
        />

        <Input
          title={t('notification.input.chat')}
          placeholder="12389741289"
          id="chat-id"
          error={errors?.chatId}
          value={inputs.data?.chatId || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, chatId: e.target.value },
            });
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '1rem',
          gap: '1rem',
        }}
      >
        <SwitchWithText
          label={t('notification.input.disable_notification')}
          shortDescription={t('notification.input.disable_description')}
          id="disable-notification"
          error={errors?.disableNotification}
          checked={inputs.data?.disableNotification || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, disableNotification: e.target.checked },
            });
          }}
        />

        <SwitchWithText
          label={t('notification.input.protect_content')}
          shortDescription={t('notification.input.protect_description')}
          id="protect-content"
          error={errors?.protectContent}
          checked={inputs.data?.protectContent || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, protectContent: e.target.checked },
            });
          }}
        />

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

export default NotificationDiscordContent;
