# @peetland/npc

NPC: склеивает свои данные, актора, инвентарь, психику и HTN-агента, который каждый тик планирует
и исполняет задачи.

## Состояние и контекст

- **Состояние** (`NpcState`) — слепок актора и сами инвентарь и психика, доступные только на
  чтение (`ReadonlyInventory`, `IReadonlyPsyche`). С ним HTN-агент планирует задачи. Эффекты задач
  состояние не меняют: сущность, которую нужно поменять, задача клонирует (`clone()`) и кладёт
  копию в новое состояние.
- **Контекст** (`NpcContext`) — живые актор, инвентарь и психика, которым задачи отдают команды.

## Корневая задача

NPC не зависит от задач. Корневую задачу HTN-агента он получает от фабрики `IRootTaskFactory`,
которую объявляет сам и получает в зависимостях. Какую реализацию передать, решает тот, кто
создаёт NPC. Фабрика создаёт каждому NPC своё дерево задач, и между NPC дерево не делится.

## Для тестов

Точка входа `@peetland/npc/dev` даёт builder состояния NPC (`NpcStateBuilder`), контекст NPC
(`createNpcContext`), данные и зависимости NPC (`createNpcData`, `createNpcDeps`) и мок фабрики NPC
(`createMockedNpcFactory`).

`NpcStateBuilder` собирает состояние по шагам: задаёте только то, что важно для теста, а остальное
заполняется незначимыми значениями. NPC стоит в начале координат, инвентарь пуст, а в мире полночь
первого дня. Психику builder собирает `PsycheFactory` с фабриками черт по умолчанию. Если тесту
важно, как психика реагирует на поступки, фабрику можно заменить через `withPsycheFactory`.

```ts
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { Feeling, Trait } from '@peetland/psyche';

const state = new NpcStateBuilder()
  .withPosition(10, 20, 3)
  .withAngle(90)
  .withInventory({ [Item.Money]: 50 })
  .withTrait(Trait.Luck, 80)
  .withFeeling(Feeling.Shame, 30)
  .withTime({ day: 1, hours: 20, minutes: 0 })
  .build();
```

Если тесту не важно ни одно поле, хватит готового состояния по умолчанию:

```ts
const state = NpcStateBuilder.default();
```
