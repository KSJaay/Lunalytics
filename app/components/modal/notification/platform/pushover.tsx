// import dependencies
import { Dropdown, Input, PasswordInput } from '@lunalytics/ui';

interface NotificationModalPushoverInputProps {
  values: {
    friendlyName: string;
    token: string;
    data: {
      userKey: string;
      applicationToken: string;
      device: string;
      priority: string;
      ttl: string;
    };
  };
  errors: {
    friendlyName?: string;
    token?: string;
    userKey?: string;
    applicationToken?: string;
    device?: string;
    priority?: string;
    messageTtl?: string;
  };
  handleInput: (input: { key: string; value: any }) => void;
}

const NotificationModalPushoverInput = ({
  values,
  errors,
  handleInput,
}: NotificationModalPushoverInputProps) => {
  const handlePriorityChange = (value: string) => {
    handleInput({ key: 'data', value: { ...values.data, priority: value } });
  };

  return (
    <>
      <Input
        title="Friendly Name"
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <PasswordInput
        title="User Key"
        placeholder="xxxxxxxxxxxxxxxx"
        id="user-key"
        isRequired
        error={errors?.userKey}
        defaultValue={values.data?.userKey || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, userKey: e.target.value },
          });
        }}
      />
      <PasswordInput
        title="Application Token"
        placeholder="Lunalytics"
        id="application-token"
        isRequired
        error={errors?.token}
        defaultValue={values.token || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />
      <Input
        title="Device"
        id="device"
        error={errors?.device}
        defaultValue={values.data?.device || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, device: e.target.value },
          });
        }}
      />

      <div className="luna-input-wrapper">
        <label className="luna-input-title">Priority</label>
        <Dropdown
          fullWidth
          items={[
            {
              id: '1',
              text: '-2',
              type: 'item',
              onClick: () => handlePriorityChange('-2'),
            },
            {
              id: '2',
              text: '-1',
              type: 'item',
              onClick: () => handlePriorityChange('-1'),
            },
            {
              id: '3',
              text: '0',
              type: 'item',
              onClick: () => handlePriorityChange('0'),
            },
            {
              id: '4',
              text: '1',
              type: 'item',
              onClick: () => handlePriorityChange('1'),
            },
            {
              id: '5',
              text: '2',
              type: 'item',
              onClick: () => handlePriorityChange('2'),
            },
          ]}
        >
          <div style={{ width: '100%', textAlign: 'left' }}>
            {values.data?.priority || '0'}
          </div>
        </Dropdown>
      </div>

      <Input
        title="Message TTL (Seconds)"
        id="message-ttl"
        error={errors?.messageTtl}
        defaultValue={values.data?.ttl || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, ttl: e.target.value },
          });
        }}
      />
    </>
  );
};

NotificationModalPushoverInput.displayName = 'NotificationModalPushoverInput';

export default NotificationModalPushoverInput;
