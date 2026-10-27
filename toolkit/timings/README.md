# @peetland/timings

Observable, которые сообщают, что прошло время. Тип `Interval` — это `Observable<number>`, каждое
значение которого говорит, сколько миллисекунд прошло с прошлого значения.

Если классу нужно что-то делать со временем, принимайте `Interval` в зависимостях, а не создавайте
таймер внутри. Так в игре время будет идти само, а в тестах — тогда, когда этого хочет тест, без
фейковых таймеров.

## IntervalObservable

Раз в `period` миллисекунд сообщает, что прошло `period` миллисекунд:

```ts
import { IntervalObservable } from '@peetland/timings';

const interval = new IntervalObservable(1000);

interval.subscribe((elapsed) => console.log(elapsed)); // 1000 раз в секунду
```

## ManualIntervalObservable

Сообщает, что прошло время, только когда вызывают `tick`. Нужен в тестах:

```ts
import { ManualIntervalObservable } from '@peetland/timings';

const interval = new ManualIntervalObservable();

interval.subscribe((elapsed) => console.log(elapsed));
interval.tick(500); // 500
```
