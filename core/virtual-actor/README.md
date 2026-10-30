# @peetland/virtual-actor

Виртуальный актор — реализация `IActor` из `@peetland/game`, такая же, как `mod/gta-sa`.

`VirtualActorFactory` создаёт акторов, которые работают без игры и хранят всё в памяти. На них
тестируются задачи, NPC и мир.

```ts
import { AnimationManager, InstantAnimationLoader } from '@peetland/animation-manager';
import { Geometry } from '@peetland/geometry';
import { Timer } from '@peetland/timings';
import { VIRTUAL_ANIMATIONS, VirtualActorFactory } from '@peetland/virtual-actor';

const factory = new VirtualActorFactory({
  animations: new AnimationManager(
    { animations: VIRTUAL_ANIMATIONS },
    { loader: new InstantAnimationLoader() }
  ),
  geometry: new Geometry(),
  timer: new Timer(),
});
const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });
```

Команды актора наследуются от `Command` из `@peetland/actor-command`.

Команда `goToCoords` при подписке сообщает текущую позицию, а затем раз в секунду по таймеру из
зависимостей сдвигает актора к точке по прямой со скоростью пешехода (5 км/ч ≈ 1,39 м/с) и сообщает
новую позицию. Когда актор входит в радиус (без учёта высоты), Observable завершается.

Команда `playAnimation` завершается, когда по таймеру проходит переданное время проигрывания, а если
его не передали, — длительность анимации из таблицы. Таблицу анимаций держит менеджер анимаций из
зависимостей фабрики: для каждой анимации обязательна запись с длительностью. Если записи или
длительности нет, `playAnimation` выбрасывает ошибку. Готовая таблица с длительностями анимаций
игры — `VIRTUAL_ANIMATIONS`. Загружать виртуальному актору нечего, поэтому менеджеру передаётся
`InstantAnimationLoader`.
