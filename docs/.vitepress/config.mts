import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Lunalytics',
  description: 'Documentation for Lunalytics',
  head: [
    ['link', { rel: 'icon', href: '/icon-192x192.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    ['link', { rel: 'apple-touch-icon', href: '/icon-192x192.png' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icon-192x192.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    [
      'meta',
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ],
    ['meta', { name: 'description', content: 'Documentation for Lunalytics' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://raw.githubusercontent.com/KSJaay/Lunalytics/main/public/icon-512x512.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/intro' },
      // { text: 'Guides', link: '/guides' },
      { text: 'API', link: '/api/monitor' },
      // { text: 'Blog', link: '/blog' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'What is Lunalytics?', link: '/intro' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Configuration', link: '/configuration' },
        ],
        collapsed: false,
      },
      {
        text: 'API',
        items: [
          { text: 'Monitor', link: '/api/monitor' },
          { text: 'Notification', link: '/api/notification' },
          { text: 'User', link: '/api/user' },
        ],
        collapsed: false,
      },
      {
        text: 'Internals',
        items: [
          // { text: 'Overview', link: '/internals/overview' },
          { text: 'Changelog', link: '/internals/changelog' },
          // { text: 'Flows', link: '/internals/flows' },
          { text: 'Notifications', link: '/internals/notifications' },
          { text: 'Permissions', link: '/internals/permissions' },
          { text: 'Roadmap', link: '/internals/roadmap' },
        ],
        collapsed: false,
      },
      {
        text: 'Contributing',
        items: [
          // { text: 'Overview', link: '/contributing/overview' },
          // { text: 'Code of Conduct', link: '/contributing/conduct' },
          { text: 'Pull request', link: '/contributing/pull-request' },
          { text: 'Testing', link: '/contributing/testing' },
          // { text: 'Issues', link: '/contributing/issues' },
        ],
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
