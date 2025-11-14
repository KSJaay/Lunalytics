import type { NotificationInputLayoutType } from '../../../types/constant/notifications';

export const SlackLayout: NotificationInputLayoutType[] = [
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
        placeholder: 'https://hooks.slack.com/services/...',
        subtitle: {
          text: 'For more information about how to create a webhook checkout this guide: ',
          link: 'https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/',
        },
      },
      {
        type: 'input',
        isDataField: true,
        key: 'username',
        title: 'Webhook Username',
        placeholder: 'Lunalytics',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'textMessage',
        title: 'Text Message',
        placeholder: 'Alert @here',
      },
    ],
  },
  {
    type: 'input',
    isDataField: true,
    key: 'channel',
    title: 'Channel name',
    placeholder: '#lunalytics-alerts',
  },
];
