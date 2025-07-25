import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

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
          value={inputs.friendlyName}
          onChange={(e) => {
            handleInput({ key: 'friendlyName', value: e.target.value });
          }}
          onBlur={handleUpdate}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          id="token"
          title="Webhook URL"
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
          title="Text Message"
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

export default NotificationDiscordContent;
