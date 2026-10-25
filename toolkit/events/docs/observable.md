# Observable

Реализация [Observable](https://github.com/WICG/observable) — веб-стандарта для работы с потоками
событий. Пакет стремится как можно точнее повторить спецификацию: те же названия, те же правила
подписки и отписки, тот же порядок вызовов.

Как пользоваться Observable, читайте в документации MDN:

- [Observable](https://developer.mozilla.org/en-US/docs/Web/API/Observable) — справочник;
- [Using observables](https://developer.mozilla.org/en-US/docs/Web/API/Observable_API/Using_observables) — подписка и отписка;
- [Creating custom observables](https://developer.mozilla.org/en-US/docs/Web/API/Observable_API/Creating_observables) — создание своих источников.

В пакете также есть `AbortController`, `AbortSignal` и `EventTarget`, на которых строится отписка.

```ts
import { AbortController, Observable } from '@toolkit/events';

const values = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.complete();
});

const controller = new AbortController();

values.subscribe((value) => console.log(value), { signal: controller.signal });
```

## Отличия от спецификации

### Вместо reportError — onError

В браузере исключения, которые некому обработать, попадают в глобальный `reportError`. Эта
функция есть не во всех окружениях, поэтому конструктор `Observable` принимает вторым параметром
`onError`. Он вызывается ровно тогда, когда по спецификации был бы вызван `reportError`:

- источник выдал `subscriber.error(...)`, а у наблюдателя нет обработчика `error`;
- executor выбросил исключение. Оно превращается в вызов `subscriber.error(...)`, поэтому
  наблюдатель с обработчиком `error` получит ошибку в него, а без обработчика ошибка уйдёт в
  `onError`;
- выбросил исключение любой из обработчиков наблюдателя (`next`, `error`, `complete`). Такое
  исключение не закрывает подписку и не мешает остальным наблюдателям;
- выбросил исключение teardown-колбэк.

```ts
const values = new Observable<number>(
  (subscriber) => {
    subscriber.error(new Error('источник сломался'));
  },
  {
    onError: (error) => console.error('необработанная ошибка', error),
  }
);

values.subscribe({ next: () => {} }); // необработанная ошибка Error: источник сломался
```

Если у нескольких наблюдателей нет обработчика `error`, `onError` вызывается отдельно для
каждого.

По умолчанию `onError` ничего не делает, и необработанные ошибки теряются молча. Передавайте
свой обработчик, чтобы ошибки в источниках не оставались незамеченными.

По той же причине `Observable.from` принимает `onError` вторым параметром. Если в `from` передан
Observable, он возвращается как есть, и переданный `onError` на него не влияет.

Observable, которые создают операторы (`switchMap`, `inspect`), получают те же опции, что и
исходный Observable, в том числе `onError`. В `inspect` он получает и исключения из колбэка
`abort`.

### Ограниченная поддержка

`Observable.from` пока принимает только Observable, массивы и промисы. Остальные итерируемые и
асинхронно итерируемые значения (строки, `Set`, генераторы) приводят к `TypeError`.

Из операторов пока реализованы только `switchMap` и `inspect`. Остальные (`map`, `filter` и
другие) будут добавляться по мере необходимости.
