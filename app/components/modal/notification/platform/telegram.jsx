// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';
import Checkbox from '../../../ui/checkbox';

const NotificationModalTelegramInput = ({
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
        label={'Bot Token'}
        placeholder="Bot Token"
        description={
          <>
            For more information about how to create a bot token checkout this
            guide:{' '}
            <a
              style={{ color: 'var(--primary-700)' }}
              href="https://lunalytics.xyz/guides/telegram/create-bot"
              target="_blank"
              rel="noreferrer"
            >
              https://lunalytics.xyz/guides/telegram/create-bot
            </a>
          </>
        }
        id="bot-token"
        isRequired
        error={errors?.token}
        defaultValue={values.token}
        onChange={(e) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />
      <TextInput
        label={'Chat ID'}
        placeholder="12389741289"
        description={
          <>
            For more information about how to find the chat ID for a channel
            checkout this guide:{' '}
            <a
              style={{ color: 'var(--primary-700)' }}
              href="https://lunalytics.xyz/guides/telegram/find-chat-id"
              target="_blank"
              rel="noreferrer"
            >
              https://lunalytics.xyz/guides/telegram/find-chat-id
            </a>
          </>
        }
        id="chat-id"
        isRequired
        error={errors?.chatId}
        defaultValue={values.chatId}
        onChange={(e) => {
          handleInput({ key: 'chatId', value: e.target.value });
        }}
      />
      <div style={{ padding: '12px 0 3px 0' }}>
        <Checkbox
          label="Disable Notification"
          description="If enabled, users will recieve a notification without any sound."
          id="disable-notification"
          error={errors?.disableNotification}
          checked={values.disableNotification}
          onChange={(e) => {
            handleInput({ key: 'disableNotification', value: e.target.value });
          }}
        />
      </div>

      <div style={{ padding: '12px 0 3px 0' }}>
        <Checkbox
          label="Protect Content"
          description="If enabled, users cannot forward or save the bots message."
          id="protect-content"
          error={errors?.protectContent}
          checked={values.protectContent}
          onChange={(e) => {
            handleInput({ key: 'protectContent', value: e.target.value });
          }}
        />
      </div>
    </>
  );
};

NotificationModalTelegramInput.displayName = 'NotificationModalTelegramInput';

NotificationModalTelegramInput.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleInput: PropTypes.func,
};

export default NotificationModalTelegramInput;
