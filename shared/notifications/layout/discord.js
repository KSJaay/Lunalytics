export const DiscordLayout = [
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
        title: 'notification.input.webhook_url',
        placeholder: 'https://discord.com/api/webhooks',
        subtitle: {
          text: 'notification.discord.token_description',
          link: 'http://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks',
        },
      },
      {
        type: 'input',
        isDataField: true,
        key: 'username',
        title: 'notification.input.webhook_username',
        placeholder: 'Lunalytics',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'textMessage',
        title: 'notification.input.text_message',
        placeholder: 'Alert @everyone',
      },
    ],
  },
];
