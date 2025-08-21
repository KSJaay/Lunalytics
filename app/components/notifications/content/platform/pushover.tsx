// import dependencies
import { Dropdown, Input, PasswordInput } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';
// import local files
import SwitchWithText from '../../../ui/switch';
import type {
  NotificationPushover,
  NotificationPushoverErrors,
} from '../../../../types/notifications';

const NotificationPushoverContent = ({
  inputs,
  errors,
  handleInput,
}: {
  inputs: NotificationPushover;
  errors: Partial<Record<keyof NotificationPushoverErrors, string>>;
  handleInput: (input: {
    key: keyof NotificationPushover | 'data';
    value: Partial<NotificationPushover['data']> | string | number | boolean;
  }) => void;
}) => {
  const handlePriorityChange = (value: string) => {
    handleInput({
      key: 'data',
      value: { ...inputs.data, priority: value },
    });
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="notification-content-container">
        <Input
          title={t('notification.input.friendly_name')}
          placeholder="Lunalytics"
          id="friendly-name"
          error={errors?.friendlyName}
          value={inputs.friendlyName || ''}
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
          value={inputs.data?.userKey || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, userKey: e.target.value },
            });
          }}
        />

        <PasswordInput
          title="Application Token"
          placeholder="Lunalytics"
          id="application-token"
          isRequired
          error={errors?.token}
          value={inputs.token || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({ key: 'token', value: e.target.value });
          }}
        />

        <Input
          title="Device"
          id="device"
          error={errors?.device}
          value={inputs.data?.device || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({
              key: 'data',
              value: { ...inputs.data, device: e.target.value },
            });
          }}
        />
      </div>

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
            {inputs.data?.priority || '0'}
          </div>
        </Dropdown>
      </div>

      <Input
        title="Message TTL (Seconds)"
        id="message-ttl"
        type="number"
        error={errors?.ttl}
        value={inputs.data?.ttl || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, ttl: e.target.value },
          });
        }}
      />

      <div style={{ paddingTop: '1rem' }}>
        <SwitchWithText
          label={t('notification.input.enabled_title')}
          shortDescription={t('notification.input.enabled_description')}
          checked={inputs.isEnabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInput({ key: 'isEnabled', value: e.target.checked });
          }}
        />
      </div>
    </>
  );
};

export default NotificationPushoverContent;
