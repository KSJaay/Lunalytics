import type { NotificationInputLayoutType } from '../../../types/constant/notifications';

export const WebhookLayout: NotificationInputLayoutType[] = [
  {
    type: 'group',
    items: [
      {
        type: 'input',
        isDataField: false,
        key: 'friendlyName',
        title: 'Friendly Name',
        placeholder: 'Lunalytics',
      },
      {
        type: 'password',
        isDataField: false,
        key: 'token',
        title: 'Webhook URL',
        placeholder: 'https://lunalytics.xyz/webhooks/example',
      },
    ],
  },
  {
    type: 'dropdown',
    isDataField: true,
    key: 'requestType',
    title: 'Request Type',
    defaultValue: 'application/json',
    options: [{ id: 'application/json' }, { id: 'form-data' }],
  },
  {
    type: 'textarea',
    isDataField: true,
    key: 'additionalHeaders',
    rows: 8,
    title: 'Additional Headers',
    subtitle: {
      text: 'Add additional headers to be sent with the webhook request. Make sure to follow JSON key/value format.',
    },
  },
];
