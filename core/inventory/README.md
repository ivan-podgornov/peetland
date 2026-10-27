# @peetland/inventory

Инвентарь персонажа: сколько у него каких предметов.

```ts
import { Inventory, Item } from '@peetland/inventory';

const inventory = new Inventory();

inventory.add(Item.Bottles, 3);
inventory.has(Item.Bottles); // true
inventory.remove(Item.Bottles, 5); // false, бутылок не хватает, инвентарь не изменился
inventory.remove(Item.Bottles, 3); // true
inventory.get(Item.Bottles); // 0
```

## Предметы

Предметы перечислены в enum `Item`: деньги (`Money`), бутылки (`Bottles`) и пойло (`Booze`). В коде
предметы всегда указываются через enum, а не строками.

## Количество

Количество предмета — целое неотрицательное число. Если в `set`, `add` или `remove` передать
отрицательное или дробное количество, будет выброшен `RangeError`. Если количество предмета становится
равным нулю, предмет удаляется из инвентаря.

## Копирование

`clone()` возвращает независимую копию инвентаря. Её можно менять в `applyEffects` HTN-задач, не
затрагивая инвентарь, по которому строится план.
