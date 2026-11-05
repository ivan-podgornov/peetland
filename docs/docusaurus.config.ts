import type { Options as PresetOptions } from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

/**
 * Путь сайта на GitHub Pages. Каждая ветка публикуется в свою подпапку, поэтому в CI путь
 * передаётся через переменную окружения, например `/peetland/feat/npc/`
 */
const baseUrl = process.env['DOCS_BASE_URL'] ?? '/';

const config: Config = {
  title: 'Peetland',
  tagline: 'Документация проекта',
  url: 'https://ivan-podgornov.github.io',
  baseUrl,
  organizationName: 'ivan-podgornov',
  projectName: 'peetland',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },
  markdown: {
    // Обычный Markdown без MDX: исходники читаются так же, как сайт
    format: 'md',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/ivan-podgornov/peetland/edit/main/docs/',
        },
        blog: false,
        pages: false,
      } satisfies PresetOptions,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Peetland',
      items: [
        {
          href: 'https://github.com/ivan-podgornov/peetland',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};

export default config;
