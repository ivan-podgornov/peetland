# @peetland/npc

NPC: склеивает свои данные, актора, инвентарь, психику и HTN-агента, который каждый тик планирует
и исполняет задачи.

## Состояние и контекст

- **Состояние** (`NpcState`) — только данные: слепки актора и психики и содержимое инвентаря. С ним
  HTN-агент планирует задачи, а эффекты задач меняют его копию.
- **Контекст** (`NpcContext`) — живые актор, инвентарь и психика, которым задачи отдают команды.

## Корневая задача

NPC не зависит от задач. Корневую задачу HTN-агента он получает от фабрики `IRootTaskFactory`,
которую объявляет сам и получает в зависимостях. Какую реализацию передать, решает тот, кто
создаёт NPC.

## Для тестов

Точка входа `@peetland/npc/dev` даёт builder состояния NPC (`NpcStateBuilder`), контекст NPC
(`createNpcContext`), данные и зависимости NPC (`createNpcData`, `createNpcDeps`) и мок фабрики NPC
(`createMockedNpcFactory`).

`NpcStateBuilder` собирает состояние по шагам: задаёте только то, что важно для теста, а остальное
заполняется незначимыми значениями. NPC стоит в начале координат, инвентарь пуст, а в мире полночь
первого дня.

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
