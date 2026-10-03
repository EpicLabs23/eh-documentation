import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Epic Labs 23',
  tagline: 'Free shared hosting software: EHM and ECP',
  favicon: 'img/epic-labs-icon.png',

  url: 'https://docs.ecpanel.io',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'EpicLabs23', // Usually your GitHub org/user name.
  projectName: 'eh-documentation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [require.resolve('docusaurus-lunr-search')],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      // title: 'My Site',
      logo: {
        alt: 'Epic Labs Logo',
        src: 'img/el23-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'EH Documentation',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/ecp-vs-compatitors', label: 'Compare', position: 'left'},
        {
          href: 'https://github.com/EpicLabs23/ecp-ehm-free',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/intro'},
            {label: 'Install on a fresh server', to: '/install-in-a-fresh-server'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Report a bug', href: 'https://github.com/EpicLabs23/ecp-ehm-free/issues'},
            {label: 'Discussions', href: 'https://github.com/EpicLabs23/ecp-ehm-free/discussions'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Epic Labs 23.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
