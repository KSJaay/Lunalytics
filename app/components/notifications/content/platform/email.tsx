// import dependencies
import { Input, PasswordInput } from '@lunalytics/ui';
import SwitchWithText from '../../../ui/switch';
import { useTranslation } from 'react-i18next';

interface NotificationModalEmailInputProps {
  inputs: {
    friendlyName: string;
    token: string;
    isEnabled: boolean;
    data: {
      port: string;
      security: boolean;
      username: string;
      password: string;
      fromEmail: string;
      toEmail: string;
      ccEmail?: string;
      bccEmail?: string;
    };
  };
  errors: {
    friendlyName?: string;
    token?: string;
    port?: string;
    security?: string;
    username?: string;
    password?: string;
    fromEmail?: string;
    toEmail?: string;
    ccEmail?: string;
    bccEmail?: string;
  };
  handleInput: (input: { key: string; value: any }) => void;
}

const NotificationModalEmailInput = ({
  inputs,
  errors,
  handleInput,
}: NotificationModalEmailInputProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Input
        title={'Friendly Name'}
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        value={inputs.friendlyName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <Input
        title="Hostname"
        subtitle={
          <>
            For more information please read nodemailer documentation:{' '}
            <a
              style={{ color: 'var(--primary-700)' }}
              href="https://nodemailer.com"
              target="_blank"
              rel="noreferrer"
            >
              https://nodemailer.com
            </a>
          </>
        }
        id="hostname"
        isRequired
        error={errors?.token}
        value={inputs.token}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />
      <Input
        title="Port"
        placeholder="Lunalytics"
        id="email-port"
        isRequired
        error={errors?.port}
        value={inputs.data?.port}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, port: e.target.value },
          });
        }}
      />
      <div style={{ padding: '1rem 0' }}>
        <SwitchWithText
          label="Security"
          shortDescription="Whether TLS (465) should be used to connect to the SMTP server"
          checked={inputs.data?.security || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInput({
              key: 'data',
              value: { ...inputs.data, security: e.target.checked },
            })
          }
        />
      </div>
      <Input
        title="Username"
        placeholder="Lunalytics"
        id="username"
        isRequired
        error={errors?.username}
        value={inputs.data?.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, username: e.target.value },
          });
        }}
      />
      <PasswordInput
        title="Password"
        placeholder="xxxxxxxxxxxx"
        id="password"
        isRequired
        error={errors?.password}
        value={inputs.data?.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, password: e.target.value },
          });
        }}
      />
      <Input
        title="From Email"
        placeholder="ksjaay@lunalytics.xyz"
        id="from-email"
        isRequired
        error={errors?.fromEmail}
        value={inputs.data?.fromEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, fromEmail: e.target.value },
          });
        }}
      />
      <Input
        title="To Email"
        placeholder="ksjaay@lunalytics.xyz, example@lunalytics.xyz"
        id="to-email"
        isRequired
        error={errors?.toEmail}
        value={inputs.data?.toEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, toEmail: e.target.value },
          });
        }}
      />
      <Input
        title="CC"
        id="cc-email"
        error={errors?.ccEmail}
        value={inputs.data?.ccEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, ccEmail: e.target.value },
          });
        }}
      />

      <Input
        title="BCC"
        id="bcc-email"
        error={errors?.bccEmail}
        value={inputs.data?.bccEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...inputs.data, bccEmail: e.target.value },
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

NotificationModalEmailInput.displayName = 'NotificationModalEmailInput';

export default NotificationModalEmailInput;
