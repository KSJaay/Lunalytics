// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';

const NotificationModalSlackInput = ({
  values = {},
  errors = {},
  handleInput,
}) => {
  return (
    <>
      <TextInput
        label={'Friendly Name'}
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <TextInput
        label={'Webhook URL'}
        placeholder="https://hooks.slack.com/services/..."
        description={
          <>
            For more information about how to create a webhook checkout this
            guide:{' '}
            <a
              style={{ color: 'var(--primary-700)' }}
              href="https://lunalytics.xyz/guides/slack/create-webhook"
              target="_blank"
              rel="noreferrer"
            >
              https://lunalytics.xyz/guides/slack/create-webhook
            </a>
          </>
        }
        id="webhook-url"
        isRequired
        error={errors?.token}
        defaultValue={values.token}
        onChange={(e) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />

      <TextInput
        label={'Webhook Username'}
        placeholder="Lunalytics"
        id="webhook-username"
        error={errors?.username}
        defaultValue={values.username}
        onChange={(e) => {
          handleInput({ key: 'username', value: e.target.value });
        }}
      />

      <TextInput
        label={'Text message'}
        placeholder="Alert @here"
        id="text-messsage"
        error={errors?.textMessage}
        defaultValue={values.textMessage}
        onChange={(e) => {
          handleInput({ key: 'textMessage', value: e.target.value });
        }}
      />
      <TextInput
        label={'Channel name'}
        placeholder="#lunalytics-alerts"
        id="channel-name"
        error={errors?.channel}
        defaultValue={values.channel}
        onChange={(e) => {
          handleInput({ key: 'channel', value: e.target.value });
        }}
      />
    </>
  );
};

NotificationModalSlackInput.displayName = 'NotificationModalSlackInput';

NotificationModalSlackInput.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleInput: PropTypes.func,
};

export default NotificationModalSlackInput;
