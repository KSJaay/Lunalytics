// import dependencies
import { Input } from '@lunalytics/ui';

interface NotificationModalDiscordInputProps {
  values: {
    friendlyName: string;
    token: string;
    data: {
      username: string;
      textMessage: string;
    };
  };
  errors: {
    friendlyName?: string;
    token?: string;
    username?: string;
    textMessage?: string;
  };
  handleInput: (input: { key: string; value: any }) => void;
}

const NotificationModalDiscordInput = ({
  values,
  errors,
  handleInput,
}: NotificationModalDiscordInputProps) => {
  return (
    <>
      <Input
        title={'Friendly Name'}
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        value={values.friendlyName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
        value={values.token}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />
      <Input
        title="Webhook Username"
        placeholder="Lunalytics"
        id="webhook-username"
        error={errors?.username}
        value={values.data?.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, username: e.target.value },
          });
        }}
      />
      <Input
        title="Text Message"
        placeholder="Alert @everyone"
        id="text-messsage"
        error={errors?.textMessage}
        value={values.data?.textMessage}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, textMessage: e.target.value },
          });
        }}
      />
    </>
  );
};

NotificationModalDiscordInput.displayName = 'NotificationModalDiscordInput';

export default NotificationModalDiscordInput;
