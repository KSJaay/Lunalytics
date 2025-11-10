export const EmailLayout = [
  {
    type: 'input',
    isDataField: false,
    key: 'friendlyName',
    title: 'Friendly Name',
    placeholder: 'Lunalytics',
  },
  {
    type: 'group',
    items: [
      {
        type: 'input',
        isDataField: false,
        key: 'token',
        title: 'Hostname',
        placeholder: 'smtp.lunalytics.xyz',
        subtitle: {
          text: 'For more information please read nodemailer documentation: ',
          link: 'https://nodemailer.com',
        },
      },
      {
        type: 'input',
        isDataField: true,
        key: 'port',
        title: 'Port',
        placeholder: '587',
      },
    ],
  },
  {
    type: 'switch',
    isDataField: true,
    key: 'security',
    title: 'Security',
    subtitle: {
      text: 'Whether TLS (465) should be used to connect to the SMTP server',
    },
  },
  {
    type: 'group',
    items: [
      {
        type: 'input',
        isDataField: true,
        key: 'username',
        title: 'Username',
        placeholder: 'Lunalytics',
      },
      {
        type: 'password',
        isDataField: true,
        key: 'password',
        title: 'Password',
        placeholder: 'xxxxxxxxxxxx',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'fromEmail',
        title: 'From Email',
        placeholder: 'ksjaay@lunalytics.xyz',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'toEmail',
        title: 'To Email(s)',
        placeholder: 'ksjaay@lunalytics.xyz, example@lunalytics.xyz',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'ccEmail',
        title: 'CC Email(s)',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'bccEmail',
        title: 'BCC Email(s)',
      },
    ],
  },
];
