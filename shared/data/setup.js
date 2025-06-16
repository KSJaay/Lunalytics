const setupPages = {
  EMAIL_FORM: 'email',
  PASSWORD_FORM: 'password',
  TYPE_FORM: 'type',
  DATABASE_FORM: 'database',
  SECRETS_FORM: 'secrets',
};

const getSetupKeys = (type, databaseType) => {
  let keys = [
    'email',
    'username',
    'password',
    'databaseType',
    'databaseName',
    'migrationType',
  ];

  if (type === 'advanced') {
    keys = [...keys, 'websiteUrl', 'retentionPeriod', 'jwtSecret'];
  }

  if (databaseType === 'pg') {
    keys = [
      ...keys,
      'postgresHost',
      'postgresPort',
      'postgresUser',
      'postgresPassword',
    ];
  }

  return keys;
};

const setupData = {
  [setupPages.EMAIL_FORM]: {
    number: 1,
    name: 'email',
    title: 'Setup Lunalytics',
    subtitle: 'Please provide your username and email',
    next: setupPages.PASSWORD_FORM,
    inputs: [
      {
        id: 'email',
        title: 'Email',
        type: 'text',
        placeholder: 'example@lunalytics.xyz',
      },
      {
        id: 'username',
        title: 'Username',
        type: 'text',
        placeholder: 'KSJaay',
      },
    ],
    required: ['email', 'username'],
  },
  [setupPages.PASSWORD_FORM]: {
    number: 2,
    name: 'password',
    title: 'Choose a password',
    subtitle: 'Please enter your password',
    next: setupPages.TYPE_FORM,
    prev: setupPages.EMAIL_FORM,
    inputs: [
      { type: 'password', id: 'password', title: 'Password' },
      { type: 'checklist' },
      { type: 'password', id: 'confirmPassword', title: 'Confirm password' },
    ],
    required: ['password', 'confirmPassword'],
  },
  [setupPages.TYPE_FORM]: {
    number: 3,
    name: 'type',
    title: 'Select setup type',
    subtitle: 'Please select one of the options below',
    next: setupPages.DATABASE_FORM,
    prev: setupPages.PASSWORD_FORM,
    hideButton: true,
  },
  [setupPages.DATABASE_FORM]: {
    number: 4,
    name: 'database',
    title: 'Select Database',
    subtitle: 'Please select one of the options below',
    next: setupPages.SECRETS_FORM,
    prev: setupPages.TYPE_FORM,
  },
  [setupPages.SECRETS_FORM]: {
    number: 5,
    name: 'secrets',
    title: 'Website Configuration',
    subtitle: 'Please enter the secret keys for configuration',
    next: 'complete',
    prev: setupPages.DATABASE_FORM,
    inputs: [
      {
        id: 'jwtSecret',
        title: 'JWT Secret',
        type: 'text',
        placeholder: 'Really-strong-secret',
      },
      {
        id: 'websiteUrl',
        title: 'Website URL',
        type: 'text',
        placeholder: 'https://lunalytics.xyz',
      },
      {
        id: 'migrationType',
        title: 'Migration Type',
        type: 'dropdown',
        options: ['automatic', 'manual'],
      },
      {
        id: 'retentionPeriod',
        title: 'Database Rentention (12h, 1d, 1w, 1m, 1y)',
        type: 'text',
        placeholder: '6m',
      },
    ],
    submit: true,
  },
};

export { setupPages, setupData, getSetupKeys };
