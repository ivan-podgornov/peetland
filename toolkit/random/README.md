# @peetland/random

Источник случайных чисел. Реализует `IRandom`: метод `chance(probability)` бросает шанс и возвращает
`true` с вероятностью `probability` — числом от 0 (никогда) до 1 (всегда).

```ts
import { Random } from '@peetland/random';

const random = new Random();

random.chance(1 / 60); // true примерно один раз из 60
```

Метод `pick(items)` возвращает случайный элемент списка, у каждого элемента одинаковый шанс:

```ts
random.pick(['мусорка у киоска', 'мусорка за рестораном']);
```

`Random` построен на `Math.random`. Если `probability` не число от 0 до 1, `chance` выбрасывает
`RangeError`. Если список пустой, `RangeError` выбрасывает `pick`.

## Зависимость от интерфейса

Если классу нужен шанс, принимайте `IRandom` в зависимостях, а не вызывайте `Math.random` напрямую.
Так в игре шанс будет случайным, а в тестах — таким, какой нужен тесту. Для тестов есть мок, у
которого шанс по умолчанию всегда выпадает или всегда не выпадает, а `pick` возвращает первый
элемент. Его методы — моки vitest: можно проверить, с чем их вызвали, и переопределить результат:

```ts
import { createMockedRandom } from '@peetland/random/dev';

const random = createMockedRandom(false);
random.chance.mockReturnValueOnce(true);

random.chance(1 / 60); // true
random.chance(1 / 60); // false
expect(random.chance).toHaveBeenCalledWith(1 / 60);
```
