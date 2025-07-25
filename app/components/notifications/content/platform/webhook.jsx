// import dependencies
import { useState } from 'react';
import { Input, Textarea } from '@lunalytics/ui';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// import local files
import SwitchWithText from '../../../ui/switch';

const NotificationDiscordContent = ({
  inputs,
  errors,
  handleInput,
  handleUpdate,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="notification-content-container">
        <Input
          title="Friendly Name"
          placeholder="Lunalytics"
          id="friendly-name"
          error={errors?.friendlyName}
          value={inputs.friendlyName || ''}
          onChange={(e) => {
            handleInput({ key: 'friendlyName', value: e.target.value });
          }}
          onBlur={handleUpdate}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          id="webhook-url"
          title="Webhook URL"
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
          onBlur={handleUpdate}
        />

        <Input
          title="Webhook Username"
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
          title="Chat ID"
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
          onBlur={handleUpdate}
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
          label="Enabled"
          shortDescription="Enable or disable the notification globally"
          checked={inputs.isEnabled}
          onChange={(e) => {
            handleInput({ key: 'isEnabled', value: e.target.checked });
            handleUpdate();
          }}
        />

        <SwitchWithText
          label="Additional Headers"
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
            handleUpdate();
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

                  handleUpdate();
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
