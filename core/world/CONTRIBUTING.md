# @peetland/world

Мир — точка сборки всего приложения. `World.bigBang` загружает места, собирает зависимости по
умолчанию и создаёт NPC.

## Корневая задача

`RootTask` — жить. Её собирает `RootTaskFactory`, которая реализует `IRootTaskFactory` из
`@peetland/npc`. Методы корневой задачи — слои, перечисленные по приоритету:

1. **Потребности** (`NeedsTask`) — то, без чего NPC не может жить.
2. **Зависимости** (`AddictionsTask`) — то, без чего NPC жить не хочет.
3. **Хобби** (`HobbiesTask`) — то, чем NPC занимается для души.
4. **Деятельность** — то, чем NPC занят по своему типу.

Планировщик берёт первый слой, в котором есть что планировать, а когда есть, решают предусловия
задач слоя. Пока потребностей, зависимостей и хобби нет ни у кого, их слои — составные задачи без
методов, и NPC занят своей деятельностью.

Каждый слой создаёт своя фабрика слоя `ILayerTaskFactory` по типу NPC: `NeedsTaskFactory`,
`AddictionsTaskFactory`, `HobbiesTaskFactory` и `ActivityTaskFactory`. Деятельность
`ActivityTaskFactory` по типу NPC берёт у фабрики деятельности этого типа (`IActivityTaskFactory`
из `@peetland/npc`), например у `HomelessActivityTaskFactory` из `@peetland/homeless`. Любую
фабрику слоя и фабрику деятельности типа можно передать в зависимостях вместо фабрики по
умолчанию.

## Для тестов

Точка входа `@peetland/world/dev` даёт игру и опции мира (`createGame`, `createWorldOptions`) и мок
фабрики корневых задач (`createMockedRootTaskFactory`).
