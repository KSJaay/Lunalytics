// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

const NotificationModalDiscordInput = ({
  values = {},
  errors = {},
  handleInput,
}) => {
  return (
    <>
      <Input
        title={'Friendly Name'}
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <Input
        title={'Webhook URL'}
        placeholder="https://discord.com/api/webhooks"
        subtitle={
          <>
            For more information about how to create a Discord webhoook checkout
            this guide:{' '}
            <a
              style={{ color: 'var(--primary-700)' }}
              href="https://lunalytics.xyz/guides/discord/create-webhook"
              target="_blank"
              rel="noreferrer"
            >
              https://lunalytics.xyz/guides/discord/create-webhook
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
      <Input
        title="Webhook Username"
        placeholder="Lunalytics"
        id="webhook-username"
        error={errors?.username}
        defaultValue={values.username}
        onChange={(e) => {
          handleInput({ key: 'username', value: e.target.value });
        }}
      />
      <Input
        title="Text Message"
        placeholder="Alert @everyone"
        id="text-messsage"
        error={errors?.textMessage}
        defaultValue={values.textMessage}
        onChange={(e) => {
          handleInput({ key: 'textMessage', value: e.target.value });
        }}
      />
    </>
  );
};

NotificationModalDiscordInput.displayName = 'NotificationModalDiscordInput';

NotificationModalDiscordInput.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleInput: PropTypes.func,
};

export default NotificationModalDiscordInput;
