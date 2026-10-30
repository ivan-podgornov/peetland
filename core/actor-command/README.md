# @peetland/actor-command

Абстрактный класс `Command`, от которого наследуются команды актора: «иди к точке», «проиграй
анимацию» и всё, что актор делает со временем. Наследник описывает только то, что делает команда.
Подписка на таймер, завершение Observable и защита от повторного завершения уже есть в `Command`.
`Command` реализует `IActorCommand`, поэтому актор может вернуть её из `goToCoords` или
`playAnimation`.

Ниже по шагам пишем команду, которая ведёт персонажа GTA к точке. Начнём с самой простой команды
и постепенно добавим к ней всё остальное.

## Шаг 1. Команда, которая ждёт

Самая простая команда ничего не делает с персонажем: она ждёт, пока пройдёт время.

```ts
import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import type { IActor } from '@peetland/game';

type WaitOptions = {
  /** Сколько ждать, в миллисекундах */
  duration: number;
};

const WAIT = { name: 'wait', updatePeriod: 100 };

class WaitCommand extends Command<void, WaitOptions> {
  private waited: number;

  constructor(actor: IActor, options: WaitOptions, deps: CommandDeps) {
    super(WAIT, actor, options, deps);
    this.waited = 0;
  }

  protected onUpdate(elapsed: number): CommandStatus {
    this.waited += elapsed;
    return this.waited >= this.options.duration ? 'success' : 'running';
  }
}
```

Что здесь происходит:

- Первый аргумент `super` — описание команды: её название и то, как часто вызывать `onUpdate`.
  Оно одинаково для всех экземпляров команды, поэтому его удобно держать в константе рядом с
  классом.
- Дальше идут актор, параметры команды и зависимости. Команда хранит их как есть, в `this.actor`,
  `this.options` и `this.deps`. Зависимости всегда идут последними. Таймер, который нужен самой
  команде, лежит в `CommandDeps`.
- `onUpdate(elapsed)` — единственный обязательный хук. `elapsed` — сколько миллисекунд прошло с
  прошлого вызова. Хук возвращает `'running'`, пока команда выполняется, и `'success'`, когда она
  выполнена.

Команда начинает выполняться не при создании, а когда подписываются на её Observable:

```ts
const command = new WaitCommand(actor, { duration: 3000 }, { timer });

command.execute().subscribe({ complete: () => console.log('Дождались') });
```

## Шаг 2. Команда, которая действует

Теперь поведём персонажа к точке. Отдать ему задачу нужно один раз, в начале команды. Для этого
есть хук `onStart`. В `onUpdate` проверяем, дошёл ли персонаж. Для проверки нужна геометрия,
поэтому добавляем её в зависимости, расширив `CommandDeps`.

```ts
type GoToCoordsOptions = {
  handle: PedHandle;
  coords: Vector3;
  completeRadius: number;
};

type GoToCoordsDeps = CommandDeps & {
  geometry: IGeometry;
};

/** Персонаж идёт шагом */
const WALK_MODE = 4;

const GO_TO_COORDS = { name: 'go-to-coords', updatePeriod: 1000 };

class GtaGoToCoordsCommand extends Command<void, GoToCoordsOptions, GoToCoordsDeps> {
  constructor(actor: IActor, options: GoToCoordsOptions, deps: GoToCoordsDeps) {
    super(GO_TO_COORDS, actor, options, deps);
  }

  protected override onStart(): void {
    const { handle, coords } = this.options;
    taskGoStraightToCoord(handle, coords.x, coords.y, coords.z, WALK_MODE, -1);
  }

  protected onUpdate(): CommandStatus {
    const { coords, completeRadius } = this.options;
    const position = this.actor.getPosition();
    const arrived = this.deps.geometry.isWithinRadius2d(position, coords, completeRadius);

    return arrived ? 'success' : 'running';
  }
}
```

Первый `onUpdate` вызывается сразу после `onStart`, с `elapsed`, равным 0. Поэтому, если персонаж
уже стоит в точке, команда завершится сразу и не будет ждать первого тика таймера.

## Шаг 3. Сообщаем, как идут дела

Пусть Observable команды сообщает позицию персонажа, пока тот идёт. Значения сообщаются защищённым
методом `emit`. Тип значения — первый параметр `Command`:

```ts
class GtaGoToCoordsCommand extends Command<Vector3, GoToCoordsOptions, GoToCoordsDeps> {
  // ...

  protected onUpdate(): CommandStatus {
    const { coords, completeRadius } = this.options;
    const position = this.actor.getPosition();
    this.emit(position);

    return this.deps.geometry.isWithinRadius2d(position, coords, completeRadius)
      ? 'success'
      : 'running';
  }
}
```

Вызывать `next`, `complete` и `error` у подписчика не нужно, да и подписчика у команды не видно.
Всё это делает `Command`.

## Шаг 4. Когда не получается

Персонаж может застрять. Посчитаем в поле `walkedFor`, сколько он уже идёт, так же, как в
`WaitCommand`. Если он идёт слишком долго, вернём `'failed'`, и Observable завершится ошибкой:

```ts
protected onUpdate(elapsed: number): CommandStatus {
  this.walkedFor += elapsed;

  if (this.walkedFor > MAX_WALK_TIME) {
    return 'failed';
  }

  // ...
}
```

С `'failed'` Observable завершается общей ошибкой «Команда go-to-coords не выполнена». Если нужна
своя ошибка, вызовите защищённый `fail(reason)`. Его можно вызвать из любого хука, например, из
`onStart`, если идти некуда:

```ts
this.fail(new Error('Персонаж застрял'));
```

## Шаг 5. Убираем за собой

Сейчас у команды есть проблема: если её прервут, персонаж продолжит идти. Ресурсы освобождаются в
хуке `onFinish(result)`. Он вызывается ровно один раз, как бы ни закончилась команда. `result`
говорит, чем она закончилась: `'success'`, `'failed'` или `'cancelled'`.

```ts
protected override onFinish(result: CommandResult): void {
  if (result !== 'success') {
    clearCharTasksImmediately(this.options.handle);
  }
}
```

Если команде что-то нужно на всё время выполнения, на это удобно подписаться с защищённым сигналом
`this.signal`. Он прерывается, когда команда закончилась, уже после `onFinish`, поэтому подписка
сама отменится, а в `onFinish` то, на что подписана команда, ещё доступно. Например, команда
анимации так держит блок анимации загруженным:

```ts
protected override onStart(): void {
  this.deps.animations
    .acquire(this.options.animation)
    .subscribe(() => this.play(), { signal: this.signal });
}
```

## Прерывание

Актор прерывает команду методом `cancel(reason)`, когда, например, получает другую команду.
Observable команды завершается ошибкой `reason`, а `onFinish` получает `'cancelled'`. Если от
Observable отписались, команда тоже считается прерванной.

Если команду прервали до подписки, при подписке Observable сразу завершится ошибкой `reason`. Ни
`onStart`, ни `onFinish` при этом не вызываются: команда так и не начала выполняться.

Завершённую команду нельзя завершить или прервать ещё раз. Повторные `cancel` и `fail`, а также
`'success'` и `'failed'` после завершения ничего не делают.
