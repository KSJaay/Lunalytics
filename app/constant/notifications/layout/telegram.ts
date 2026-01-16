import type { NotificationInputLayoutType } from '../../../../shared/types/constant/notifications';

export const TelegramLayout: NotificationInputLayoutType[] = [
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
        title: 'Bot Token',
        placeholder: 'Bot Token',
        subtitle: {
          text: 'For more information about how to create a bot token checkout this guide: ',
          link: 'https://core.telegram.org/bots/tutorial',
        },
      },
      {
        type: 'input',
        isDataField: true,
        key: 'chatId',
        title: 'Chat ID',
        placeholder: '12389741289',
        subtitle: {
          text: 'For more information about how to find the chat ID for a channel checkout this guide: ',
          link: 'https://gist.github.com/nafiesl/4ad622f344cd1dc3bb1ecbe468ff9f8a',
        },
      },
    ],
  },
  { type: 'empty' },
  {
    type: 'switch',
    isDataField: true,
    key: 'disableNotification',
    title: 'Disable Notification',
    subtitle: {
      text: 'If enabled, users will receive a notification without any sound.',
    },
  },
  {
    type: 'switch',
    isDataField: true,
    key: 'protectContent',
    title: 'Protect Content',
    subtitle: {
      text: 'If enabled, message content will be protected from forwarding and saving.',
    },
  },
];
