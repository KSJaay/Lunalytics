import type { NotificationInputLayoutType } from '../../../../shared/types/constant/notifications';

export const HomeAssistantLayout: NotificationInputLayoutType[] = [
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
        type: 'input',
        isDataField: true,
        key: 'homeAssistantUrl',
        title: 'HomeAssistant URL',
        placeholder: 'https://www.home-assistant.io',
        subtitle: {
          text: 'The URL of your Home Assistant instance.',
        },
      },
      {
        type: 'input',
        isDataField: true,
        key: 'homeAssistantNotificationService',
        title: 'Notification Service',
        placeholder: 'mobile_app_<device_name>',
        subtitle: {
          text: 'Notification service to use.',
        },
      },
      {
        type: 'password',
        isDataField: false,
        key: 'token',
        title: 'Long Lived Access Token',
        subtitle: {
          text: 'Long-lived access tokens can be created using the "Long-Lived Access Tokens" section at the bottom of a user\'s Home Assistant profile page.',
        },
      },
    ],
  },
];
