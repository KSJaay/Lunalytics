import type { NotificationInputLayoutType } from '../../../types/constant/notifications';

export const AppriseLayout: NotificationInputLayoutType[] = [
  {
    type: 'group',
    items: [
      {
        type: 'input',
        isDataField: false,
        key: 'friendlyName',
        title: 'notification.input.friendly_name',
        placeholder: 'Lunalytics',
      },
      {
        type: 'password',
        isDataField: false,
        key: 'token',
        title: 'Apprise Webhook URL',
        placeholder: 'https://apprise.lunalytics.xyz/notify',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'urls',
        title: 'Notification URL(s)',
        placeholder:
          'discord://webhook_id/webhook_token, pushover://user_key/app_token',
        subtitle: {
          text: 'Seperate multiple URLs with commas to send to multiple services. For more information, see the Apprise documentation: ',
          link: 'https://github.com/caronc/apprise-api',
        },
      },
    ],
  },
];
