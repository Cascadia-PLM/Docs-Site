import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Cascadia PLM Documentation',
  tagline: 'Code-First Product Lifecycle Management',
  favicon: 'img/logo-icon.svg',

  future: {
    v4: true,
  },

  url: 'https://docs.cascadiaplm.com',
  baseUrl: '/',

  organizationName: 'cascadiaplm',
  projectName: 'cascadia',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  presets: [
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'cascadia-api',
            spec: 'openapi/openapi.yaml',
            route: '/api-reference/',
          },
        ],
        theme: {
          primaryColor: '#3366CC',
        },
      },
    ],
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/cascadia-plm/CascadiaPLM/tree/main/DocsSite/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/cascadia-social-card.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Cascadia PLM',
      logo: {
        alt: 'Cascadia PLM Logo',
        src: 'img/logo-icon.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/api-reference/',
          position: 'left',
          label: 'API Reference',
        },
        {
          href: 'https://cascadiaplm.com',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/cascadia-plm/CascadiaPLM',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started/introduction',
            },
            {
              label: 'User Guide',
              to: '/user-guide/parts-management',
            },
            {
              label: 'Deployment',
              to: '/deployment/docker-compose',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/cascadia-plm/CascadiaPLM',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/cascadia-plm/CascadiaPLM/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://cascadiaplm.com',
            },
            {
              label: 'AGPL License',
              href: 'https://github.com/cascadia-plm/CascadiaPLM/blob/main/LICENSE',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Cascadia PLM. Open Source under AGPL License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'sql', 'yaml', 'json', 'nginx'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
