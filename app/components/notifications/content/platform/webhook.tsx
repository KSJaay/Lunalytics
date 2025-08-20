// import dependencies
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@lunalytics/ui';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// import local files
import SwitchWithText from '../../../ui/switch';
import type { NotificationWebhook } from '../../../../types/notifications';

const NotificationDiscordContent = ({
  inputs,
  errors,
  handleInput,
}: {
  inputs: NotificationWebhook;
  errors: Partial<Record<keyof NotificationWebhook, string>>;
  handleInput: (
    input: Partial<Record<keyof NotificationWebhook, string>>
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
          onChange={(e) => {
            handleInput({ key: 'friendlyName', value: e.target.value });
          }}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          id="webhook-url"
          title={t('notification.input.webhook_url')}
          placeholder="https://lunalytics.xyz/webhooks/example"
          error={errors?.token}
          value={inputs.token || ''}
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
        />

        <Input
          title={t('notification.input.request_type')}
          placeholder="12389741289"
          id="chat-id"
          error={errors?.chatId}
          value={inputs.data.chatId}
          onChange={(e) => {
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
          label={t('notification.input.enabled_title')}
          shortDescription={t('notification.input.enabled_description')}
          checked={inputs.isEnabled}
          onChange={(e) => {
            handleInput({ key: 'isEnabled', value: e.target.checked });
          }}
        />

        <SwitchWithText
          label={t('notification.input.additional_headers')}
          id="additional-headers"
          checked={inputs.data.showAdditionalHeaders}
          onChange={(e) => {
            handleInput({
              key: 'data',
              value: {
                ...inputs.data,
                showAdditionalHeaders: e.target.checked,
              },
            });
          }}
          description={
            inputs.data.showAdditionalHeaders && (
              <Textarea
                rows={8}
                error={errors.additionalHeaders}
                id="additional-headers-textarea"
                placeholder='{"Content-Type": "application/json"}'
                value={inputs.data.additionalHeaders}
                onChange={(e) => {
                  handleInput({
                    key: 'data',
                    value: {
                      ...inputs.data,
                      additionalHeaders: e.target.value,
                    },
                  });
                }}
              >
                {inputs.data.additionalHeaders}
              </Textarea>
            )
          }
        />
      </div>
    </>
  );
};

export default NotificationDiscordContent;
