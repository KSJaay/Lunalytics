export const providers = [
  {
    id: 'custom',
    name: 'Custom Provider',
    description: 'Setup a custom provider like Authentik, Keycloak, etc.',
    icon: '/logo.svg',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Allow users to sign in with their Discord account',
    icon: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/discord.svg',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Allow users to sign in with their GitHub account',
    icon: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/github.svg',
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Allow users to sign in with their Google account',
    icon: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/google.svg',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Allow users to sign in with their Instagram account',
    icon: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/instagram.svg',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Allow users to sign in with their Slack account',
    icon: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/slack.svg',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    description: 'Allow users to sign in with their Twitch account',
    icon: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/twitch.svg',
  },
];

export const getProviderById = (id) => {
  return providers.find((provider) => provider.id === id);
};
