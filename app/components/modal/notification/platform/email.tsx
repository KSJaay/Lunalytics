// import dependencies
import { Input, PasswordInput } from '@lunalytics/ui';
import SwitchWithText from '../../../ui/switch';

interface NotificationModalEmailInputProps {
  values: {
    friendlyName: string;
    token: string;
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
  values,
  errors,
  handleInput,
}: NotificationModalEmailInputProps) => {
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
        value={values.token}
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
        value={values.data?.port}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, port: e.target.value },
          });
        }}
      />
      <div style={{ padding: '1rem 0' }}>
        <SwitchWithText
          label="Security"
          shortDescription="Whether TLS (465) should be used to connect to the SMTP server"
          checked={values.data?.security || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInput({
              key: 'data',
              value: { ...values.data, security: e.target.checked },
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
        value={values.data?.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, username: e.target.value },
          });
        }}
      />
      <PasswordInput
        title="Password"
        placeholder="xxxxxxxxxxxx"
        id="password"
        isRequired
        error={errors?.password}
        value={values.data?.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, password: e.target.value },
          });
        }}
      />
      <Input
        title="From Email"
        placeholder="ksjaay@lunalytics.xyz"
        id="from-email"
        isRequired
        error={errors?.fromEmail}
        value={values.data?.fromEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, fromEmail: e.target.value },
          });
        }}
      />
      <Input
        title="To Email"
        placeholder="ksjaay@lunalytics.xyz, example@lunalytics.xyz"
        id="to-email"
        isRequired
        error={errors?.toEmail}
        value={values.data?.toEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, toEmail: e.target.value },
          });
        }}
      />
      <Input
        title="CC"
        id="cc-email"
        error={errors?.ccEmail}
        value={values.data?.ccEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, ccEmail: e.target.value },
          });
        }}
      />

      <Input
        title="BCC"
        id="bcc-email"
        error={errors?.bccEmail}
        value={values.data?.bccEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput({
            key: 'data',
            value: { ...values.data, bccEmail: e.target.value },
          });
        }}
      />
    </>
  );
};

NotificationModalEmailInput.displayName = 'NotificationModalEmailInput';

export default NotificationModalEmailInput;
