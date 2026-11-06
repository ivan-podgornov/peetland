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
 * Оставляет в автоматическом сайдбаре пакетов только техническую документацию: README — продуктовая
 * документация, она стоит в сайдбаре «Продукт». Страницы из папки `docs` пакета показываются прямо
 * под пакетом, а не во вложенной категории `docs`
 */
function technicalItems(items: SidebarItem[]): SidebarItem[] {
  return items.flatMap((item) => {
    if (item.type === 'doc' && /(^|\/)README$/.test(item.id)) {
      return [];
    }

    if (item.type !== 'category') {
      return [item];
    }

    const children = technicalItems(item.items);

    if (item.label === 'docs') {
      return children;
    }

    item.items = children;

    return [item];
  });
}

/** Слои монорепозитория. Документацию пакетов каждого слоя читает свой инстанс плагина */
const LAYERS = ['toolkit', 'core', 'mod'];

/**
 * Сайдбары слоёв. У каждого слоя есть автоматический сайдбар «Пакеты», а у core ещё и сайдбар
 * «Продукт» (см. sidebars-core.ts)
 */
const LAYER_SIDEBARS: Record<string, string> = {
  core: './sidebars-core.ts',
};

/**
 * Инстанс плагина документации, который читает документацию пакетов слоя прямо из пакетов:
 * продуктовую в README и техническую в CONTRIBUTING и папке docs. Источник у неё один. На каждый
 * слой свой инстанс, потому что инстанс компилирует все Markdown-файлы в своей папке, и инстанс с
 * корнем репозитория скомпилировал бы страницы основной документации ещё раз
 */
function layerPlugin(layer: string): [string, DocsPluginOptions] {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id: layer,
      path: `../${layer}`,
      include: ['*/README.md', '*/CONTRIBUTING.md', '*/docs/**/*.md'],
      routeBasePath: layer,
      ...(LAYER_SIDEBARS[layer] && { sidebarPath: LAYER_SIDEBARS[layer] }),
      async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
        return technicalItems(
          await defaultSidebarItemsGenerator({
            ...args,
            // В сайдбаре пакетов главная страница пакета — CONTRIBUTING, а не README
            isCategoryIndex: (doc) => doc.fileName.toLowerCase() === 'contributing',
          })
        );
      },
      ...(DOCS_REPOSITORY_URL && {
        // Путь от корня репозитория: строковый editUrl считает путь от папки сайта
        editUrl: ({ docPath }) => `${DOCS_REPOSITORY_URL}/edit/${DOCS_BRANCH}/${layer}/${docPath}`,
      }),
    },
  ];
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
  plugins: LAYERS.map(layerPlugin),
  presets: [
    [
      'classic',
      {
        docs: {
          // Страницы лежат прямо в пакете, рядом с конфигом
          path: '.',
          exclude: [
            // Исключения плагина по умолчанию: при exclude их нужно перечислять самим
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'node_modules/**',
            'build/**',
            '.docusaurus/**',
          ],
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
          label: 'Проект',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'product',
          docsPluginId: 'core',
          label: 'Продукт',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Пакеты',
          position: 'left',
          items: LAYERS.map((layer) => ({
            type: 'docSidebar',
            // Без своего файла сайдбаров у слоя один автоматический сайдбар defaultSidebar
            sidebarId: LAYER_SIDEBARS[layer] ? 'packages' : 'defaultSidebar',
            docsPluginId: layer,
            label: layer,
          })),
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
