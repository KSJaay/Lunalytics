// import dependencies
import { Input } from '@lunalytics/ui';

interface NotificationModalSlackInputProps {
  values: {
    friendlyName: string;
    token: string;
    data: {
      username: string;
      textMessage: string;
      channel: string;
    };
  };
  errors: {
    friendlyName?: string;
    token?: string;
    username?: string;
    textMessage?: string;
    channel?: string;
  };
  handleInput: (input: { key: string; value: any }) => void;
}

const NotificationModalSlackInput = ({
  values,
  errors,
  handleInput,
}: NotificationModalSlackInputProps) => {
  return (
    <>
      <Input
        title={'Friendly Name'}
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />

      <Input
        title={'Webhook URL'}
        placeholder="https://hooks.slack.com/services/..."
        subtitle={
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />

      <Input
        title="Webhook Username"
        placeholder="Lunalytics"
        id="webhook-username"
        error={errors?.username}
        defaultValue={values.data?.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, username: e.target.value },
          });
        }}
      />

      <Input
        title="Text message"
        placeholder="Alert @here"
        id="text-messsage"
        error={errors?.textMessage}
        defaultValue={values.data?.textMessage}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, textMessage: e.target.value },
          });
        }}
      />

      <Input
        title="Channel name"
        placeholder="#lunalytics-alerts"
        id="channel-name"
        error={errors?.channel}
        defaultValue={values.data?.channel}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, channel: e.target.value },
          });
        }}
      />
    </>
  );
};

NotificationModalSlackInput.displayName = 'NotificationModalSlackInput';

export default NotificationModalSlackInput;
