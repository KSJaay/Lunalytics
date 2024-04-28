import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Lunalytics',
  description: 'Documentation for Lunalytics',
  themeConfig: {
    logo: 'https://raw.githubusercontent.com/KSJaay/Lunalytics/main/public/icon-512x512.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/intro' },
      { text: 'API', link: '/api/monitor' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [{ text: 'What is Lunalytics?', link: '/intro' }],
        collapsed: false,
      },
      {
        text: 'API',
        items: [
          { text: 'Monitor', link: '/api/monitor' },
          { text: 'User', link: '/api/user' },
        ],
        collapsed: false,
      },
      {
        text: 'Internals',
        items: [{ text: 'Changelog', link: '/internals/changelog' }],
        collapsed: false,
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KSJaay/Lunalytics' },
    ],
    footer: {
      copyright:
        'Copyright © 2023 - present <a href="https://github.com/KSJaay">KSJaay</a>',
    },
    lastUpdated: {
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    editLink: {
      pattern: 'https://github.com/KSJaay/lunalytics/edit/main/docs/:path',
    },
    search: {
      provider: 'local',
    },
  },
  lastUpdated: true,
});
