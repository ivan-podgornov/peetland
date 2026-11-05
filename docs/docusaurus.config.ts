import type { Options as PresetOptions } from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

/*
 * Адреса передаются через переменные окружения, чтобы сайт не был привязан к конкретному
 * репозиторию. В CI их собирают из контекста GitHub Actions, а локально они не нужны
 */
const {
  /** Адрес сайта без пути, например `https://ivan-podgornov.github.io` */
  DOCS_URL = 'http://localhost',
  /** Путь сайта. Каждая ветка публикуется в свою папку, например `/peetland/feat/npc/` */
  DOCS_BASE_URL = '/',
  /** Адрес репозитория для ссылок на GitHub и на редактирование страниц */
  DOCS_REPOSITORY_URL,
  /** Ветка, в которой редактируются страницы */
  DOCS_BRANCH = 'main',
} = process.env;

const config: Config = {
  title: 'Peetland',
  tagline: 'Документация проекта',
  url: DOCS_URL,
  baseUrl: DOCS_BASE_URL,
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
          ...(DOCS_REPOSITORY_URL && {
            editUrl: `${DOCS_REPOSITORY_URL}/edit/${DOCS_BRANCH}/docs/`,
          }),
        },
        blog: false,
        pages: false,
      } satisfies PresetOptions,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Peetland',
      items: DOCS_REPOSITORY_URL
        ? [
            {
              href: DOCS_REPOSITORY_URL,
              label: 'GitHub',
              position: 'right',
            },
          ]
        : [],
    },
  },
};

export default config;
