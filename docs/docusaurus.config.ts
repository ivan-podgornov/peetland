import type { Options as DocsPluginOptions } from '@docusaurus/plugin-content-docs';
import type { Options as PresetOptions } from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

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

/** Корень репозитория */
const ROOT = resolve(__dirname, '..');

/**
 * Продуктовые страницы: страница сайта и README пакета, из которого она берётся. Продуктовое
 * описание живёт в пакете, а на сайте показывается в разделах для игрока, поэтому страница — копия
 * README. Копии создаются при каждом запуске сайта и не хранятся в git (см. .gitignore)
 */
const PRODUCT_PAGES: Record<string, string> = {
  'npc/homeless.md': 'core/homeless/README.md',
};

/** Копирует README пакетов на места продуктовых страниц */
function copyProductPages(): void {
  for (const [page, source] of Object.entries(PRODUCT_PAGES)) {
    const target = resolve(__dirname, page);

    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(resolve(ROOT, source), target);
  }
}

// Копии нужны до того, как плагин документации прочитает страницы
copyProductPages();

/**
 * Плагин, который при правке README продуктовых страниц в `npm start` обновляет их копии. Копию
 * замечает плагин документации и перезагружает страницу
 */
function productPagesPlugin() {
  return {
    name: 'product-pages',
    getPathsToWatch: () => Object.values(PRODUCT_PAGES).map((source) => resolve(ROOT, source)),
    loadContent: copyProductPages,
  };
}

/** Слои монорепозитория, CONTRIBUTING пакетов которых попадают в раздел «Пакеты» */
const LAYERS = ['toolkit', 'core', 'mod'];

/**
 * Инстанс плагина документации, который читает техническую документацию пакетов слоя прямо из
 * пакетов: CONTRIBUTING и папку docs. Источник у неё один. На каждый слой свой инстанс, потому что инстанс компилирует все Markdown-файлы в своей
 * папке, и инстанс с корнем репозитория скомпилировал бы страницы основной документации ещё раз
 */
function packagesPlugin(layer: string): [string, DocsPluginOptions] {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id: layer,
      path: `../${layer}`,
      include: ['*/CONTRIBUTING.md', '*/docs/**/*.md'],
      routeBasePath: `packages/${layer}`,
      async sidebarItemsGenerator({ defaultSidebarItemsGenerator, isCategoryIndex, ...args }) {
        return unwrapDocsFolders(
          await defaultSidebarItemsGenerator({
            ...args,
            // CONTRIBUTING — главная страница пакета, как README или index
            isCategoryIndex: (doc) =>
              doc.fileName.toLowerCase() === 'contributing' || isCategoryIndex(doc),
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
      // Ссылка на продуктовый README пакета ведёт на его страницу на сайте, а другие битые ссылки
      // ломают сборку
      onBrokenMarkdownLinks: ({ sourceFilePath, url }) => {
        const [path = '', hash] = url.split('#');
        const target = relative(ROOT, resolve(__dirname, dirname(sourceFilePath), path));
        const page = Object.keys(PRODUCT_PAGES).find((key) => PRODUCT_PAGES[key] === target);

        if (!page) {
          throw new Error(`Битая ссылка ${url} в ${sourceFilePath}`);
        }

        return `/${page.replace(/\.md$/, '/')}${hash ? `#${hash}` : ''}`;
      },
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [productPagesPlugin, ...LAYERS.map(packagesPlugin)],
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
            // Продуктовая страница редактируется в README пакета, а не в своей копии
            editUrl: ({ docPath }) => {
              const path = PRODUCT_PAGES[docPath] ?? relative(ROOT, resolve(__dirname, docPath));

              return `${DOCS_REPOSITORY_URL}/edit/${DOCS_BRANCH}/${path}`;
            },
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
          type: 'dropdown',
          label: 'Пакеты',
          position: 'left',
          items: LAYERS.map((layer) => ({
            type: 'docSidebar',
            sidebarId: 'defaultSidebar',
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
