// import dependencies
import { Input } from '@lunalytics/ui';

// import local files
import Switch from '../../../ui/switch';

interface NotificationModalTelegramInputProps {
  values: {
    friendlyName: string;
    token: string;
    data: {
      chatId: string;
      disableNotification: boolean;
      protectContent: boolean;
    };
  };
  errors: {
    friendlyName?: string;
    token?: string;
    chatId?: string;
    disableNotification?: string;
    protectContent?: string;
  };
  handleInput: (input: { key: string; value: any }) => void;
}

const NotificationModalTelegramInput = ({
  values,
  errors,
  handleInput,
}: NotificationModalTelegramInputProps) => {
  return (
    <>
      <Input
        title="Friendly Name"
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />

      <Input
        title="Bot Token"
        placeholder="Bot Token"
        subtitle={
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />

      <Input
        title="Chat ID"
        placeholder="12389741289"
        subtitle={
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
        defaultValue={values.data?.chatId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, chatId: e.target.value },
          });
        }}
      />

      <div style={{ padding: '12px 0 3px 0' }}>
        <Switch
          label="Disable Notification"
          description="If enabled, users will recieve a notification without any sound."
          id="disable-notification"
          error={errors?.disableNotification}
          checked={values.data?.disableNotification}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...values.data, disableNotification: e.target.checked },
            });
          }}
        />
      </div>

      <div style={{ padding: '12px 0 3px 0' }}>
        <Switch
          label="Protect Content"
          description="If enabled, users cannot forward or save the bots message."
          id="protect-content"
          error={errors?.protectContent}
          checked={values.data?.protectContent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...values.data, protectContent: e.target.checked },
            });
          }}
        />
      </div>
    </>
  );
};

NotificationModalTelegramInput.displayName = 'NotificationModalTelegramInput';

export default NotificationModalTelegramInput;
