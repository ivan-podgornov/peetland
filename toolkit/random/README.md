# @peetland/random

Источник случайных чисел. Реализует `IRandom`: метод `chance(probability)` бросает шанс и возвращает
`true` с вероятностью `probability` — числом от 0 (никогда) до 1 (всегда).

```ts
import { Random } from '@peetland/random';

const random = new Random();

random.chance(1 / 60); // true примерно один раз из 60
```

`Random` построен на `Math.random`, который в Lua становится `math.random`. Если `probability` не
число от 0 до 1, `chance` выбрасывает `RangeError`.

## Зависимость от интерфейса

Если классу нужен шанс, принимайте `IRandom` в зависимостях, а не вызывайте `Math.random` напрямую.
Так в игре шанс будет случайным, а в тестах — таким, какой нужен тесту. Для тестов есть мок, у
которого шанс всегда выпадает или всегда не выпадает:

```ts
import { createMockedRandom } from '@peetland/random/dev';

const lucky = createMockedRandom(true);
const unlucky = createMockedRandom(false);
```
