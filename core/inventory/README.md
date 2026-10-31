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

Количество предмета — конечное неотрицательное число, в том числе дробное: например, у персонажа
может быть пол яблока. Если в конструктор, `set`, `add` или `remove` передать отрицательное количество,
`NaN` или `Infinity`, будет выброшен `RangeError`. Если количество предмета становится
равным нулю, предмет удаляется из инвентаря.

## Сохранение

`getAll()` возвращает объект с количеством всех предметов, которые есть в инвентаре, а конструктор
принимает такой же объект. Так инвентарь можно сохранить, например в файл, и потом восстановить:

```ts
const saved = inventory.getAll(); // { bottles: 3, money: 0.5 }
const restored = new Inventory(saved);
```
