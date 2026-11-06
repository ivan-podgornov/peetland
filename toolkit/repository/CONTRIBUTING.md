# @peetland/repository

Интерфейс репозитория и его реализация в памяти. Через репозитории данные о записях (например, об
NPC и местах) передаются туда, где они нужны, без знания о том, где эти данные хранятся.

```ts
import { InMemoryRepository } from '@peetland/repository';

const places = new InMemoryRepository([
  { id: 'bin-1', type: PlaceType.TrashBin },
  { id: 'shop-1', type: PlaceType.Shop },
]);

await places.getAll(); // обе записи
await places.getById('bin-1'); // { id: 'bin-1', type: PlaceType.TrashBin }
await places.find({ type: { eq: PlaceType.TrashBin } }); // [{ id: 'bin-1', ... }]
```

## Записи

Запись — любой объект с полем `id` (`Entity<Id>`). По умолчанию `id` — строка, но тип можно задать
вторым параметром: `IRepository<Npc, number>`.

## Интерфейс

`IRepository` асинхронный: все методы возвращают `Promise`, чтобы реализацию в памяти можно было
заменить на хранилище с асинхронным доступом без изменения вызывающего кода.

- `getAll()` — все записи;
- `getById(id)` — запись по `id` или `undefined`;
- `find(criteria)` — записи, подходящие под все критерии.

## Критерии поиска

`Criteria<T>` — объект условий по полям записи. Условия на разные поля объединяются через И. Поиск
через ИЛИ не поддерживается.

`Condition<V>` — условие на одно поле. Оператор задаётся ключом и всегда пишется явно:

```ts
await places.find({ type: { eq: PlaceType.TrashBin }, isOpen: { eq: true } });
```

Сейчас поддерживается только `eq` — строгое равенство. Он предназначен для примитивных полей: условие
на поле-объект не пройдёт проверку типов.
