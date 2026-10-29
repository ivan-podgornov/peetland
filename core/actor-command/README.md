# @peetland/actor-command

Абстрактный класс `Command` для команд актора. Он берёт на себя всё, что одинаково у любой команды:
подписывается на таймер, завершает Observable команды и не даёт завершить или прервать её повторно.
В наследнике остаётся только то, что команда делает.

Класс намеренно привязан к актору, а не сделан универсальным «периодическим процессом».

## Параметры

Конструктор принимает три параметра и хранит их как есть, в `this.context`, `this.options` и
`this.deps`:

- `context` — актор, который выполняет команду, и подписчик её Observable;
- `options` — параметры команды, например, координаты и радиус;
- `deps` — зависимости: таймер, который нужен самой команде, и то, что нужно наследнику.

Период обновления наследник передаёт четвёртым аргументом в `super`.

## Хуки

- `onStart()` — команда начинает выполняться;
- `onUpdate(elapsed)` — вызывается сразу после `onStart`, а потом раз в период обновления.
  Возвращает `'running'`, `'success'` или `'failed'`. `elapsed` — сколько миллисекунд прошло с
  прошлого вызова, для первого вызова — 0;
- `onFinish()` — команда выполнена;
- `onCancel()` — команду прервали через `cancel(reason)`.

Обязателен только `onUpdate`. Раз первый `onUpdate` вызывается сразу, команда, которая выполнена ещё
до начала, например, актор уже стоит в точке, завершается при старте и на таймер не подписывается.

## Завершение

- `'success'` или `stop()` — вызывается `onFinish`, Observable завершается успешно;
- `'failed'` — Observable завершается общей ошибкой;
- `fail(reason)` — Observable завершается ошибкой `reason`;
- `cancel(reason)` — вызывается `onCancel`, Observable завершается ошибкой `reason`.

`onFinish` и `onCancel` не вызываются, когда выполнить команду не удалось. Если команда уже
завершена или от её Observable отписались, эти методы ничего не делают. Освобождать ресурсы, которые
нужны в любом случае, лучше через `context.subscriber.addTeardown`.

Наследник не вызывает `complete` и `error` у подписчика сам. Значения он сообщает через `emit(value)`.

```ts
class WaitCommand extends Command<void, { duration: number }> {
  readonly name = 'wait';
  private waited = 0;

  constructor(context: CommandContext<void>, options: { duration: number }, deps: CommandDeps) {
    super(context, options, deps, 100);
  }

  protected onUpdate(elapsed: number): CommandStatus {
    this.waited += elapsed;
    return this.waited >= this.options.duration ? 'success' : 'running';
  }
}
```
