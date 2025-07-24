// import dependencies
import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// import local files
import SwitchWithText from '../../../ui/switch';

const NotificationSlackContent = ({
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
          title={'Webhook URL'}
          placeholder="https://hooks.slack.com/services/..."
          id="webhook-url"
          error={errors?.token}
          value={inputs.token || ''}
          onChange={(e) => {
            handleInput({ key: 'token', value: e.target.value });
          }}
          onBlur={handleUpdate}
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
          title="Webhook Username"
          placeholder="Lunalytics"
          id="webhook-username"
          error={errors?.username}
          value={inputs.data.username || ''}
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
          value={inputs.data.textMessage || ''}
          onChange={(e) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, textMessage: e.target.value },
            });
          }}
          onBlur={handleUpdate}
        />
      </div>

      <Input
        title="Channel name"
        placeholder="lunalytics-alerts"
        id="channel-name"
        error={errors?.channel}
        value={inputs.data.channel || ''}
        onChange={(e) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, channel: e.target.value },
          });
        }}
        onBlur={handleUpdate}
      />

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

export default NotificationSlackContent;
