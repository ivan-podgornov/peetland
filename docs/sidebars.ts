import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index',
    'principles/index',
    'architecture/index',
    'decisions/index',
    // README пакетов собирает отдельный инстанс плагина документации со своим сайдбаром
    {
      type: 'link',
      label: 'Пакеты',
      href: '/packages/',
    },
    'npc/index',
    'process/index',
  ],
};

export default sidebars;
