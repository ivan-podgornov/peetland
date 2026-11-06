/**
 * Правила направления зависимостей между слоями (см. docs/architecture/index.md#слои). Нижний слой
 * не знает о верхних: toolkit не зависит от core и mod, а core — от mod
 * @type {import('dependency-cruiser').IConfiguration}
 */
export default {
  forbidden: [
    {
      name: 'toolkit-not-to-core-or-mod',
      comment: 'toolkit не зависит от бизнес-логики и мода: он нижний слой',
      severity: 'error',
      from: { path: '^toolkit/' },
      to: { path: '^(core|mod)/' },
    },
    {
      name: 'core-not-to-mod',
      comment: 'core не знает об игре и MoonLoader: их реализует слой mod',
      severity: 'error',
      from: { path: '^core/' },
      to: { path: '^mod/' },
    },
    {
      name: 'no-circular',
      comment: 'Циклические зависимости запрещены',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)(node_modules|dist)/' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
  },
};
