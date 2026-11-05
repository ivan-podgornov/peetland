import type { Options as DocsPluginOptions } from '@docusaurus/plugin-content-docs';
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

type SidebarItemsGenerator = NonNullable<DocsPluginOptions['sidebarItemsGenerator']>;
type SidebarItem = Awaited<ReturnType<SidebarItemsGenerator>>[number];

/**
 * Страницы из папки `docs` пакета показываются в сайдбаре прямо под пакетом, а не во вложенной
 * категории `docs`
 */
function unwrapDocsFolders(items: SidebarItem[]): SidebarItem[] {
  return items.flatMap((item) => {
    if (item.type !== 'category') {
      return [item];
    }

    const children = unwrapDocsFolders(item.items);

    if (item.label === 'docs') {
      return children;
    }

    item.items = children;

    return [item];
  });
}

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
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        // README пакетов остаются в пакетах, а сайт читает их оттуда: источник у них один
        id: 'packages',
        path: '..',
        include: ['{toolkit,core,mod}/*/README.md', '{toolkit,core,mod}/*/docs/**/*.md'],
        routeBasePath: 'packages',
        sidebarPath: './sidebars-packages.ts',
        async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
          return unwrapDocsFolders(await defaultSidebarItemsGenerator(args));
        },
        ...(DOCS_REPOSITORY_URL && {
          // Путь от корня репозитория: строковый editUrl считает путь от папки сайта
          editUrl: ({ docPath }) => `${DOCS_REPOSITORY_URL}/edit/${DOCS_BRANCH}/${docPath}`,
        }),
      } satisfies DocsPluginOptions,
    ],
  ],
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
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          label: 'Документация',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'packages',
          docsPluginId: 'packages',
          label: 'Пакеты',
          position: 'left',
        },
        ...(DOCS_REPOSITORY_URL
          ? [
              {
                href: DOCS_REPOSITORY_URL,
                label: 'GitHub',
                position: 'right',
              },
            ]
          : []),
      ],
    },
  },
};

export default config;
