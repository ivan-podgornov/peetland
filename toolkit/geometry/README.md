# @peetland/geometry

Набор базовых геометрических операций над точками на плоскости и в пространстве: расстояние между
точками, попадание в радиус, пошаговое перемещение к цели и углы поворота.

```ts
import { Geometry } from '@peetland/geometry';

const geometry = new Geometry();

geometry.getDistance3d({ x: 0, y: 0, z: 0 }, { x: 2, y: 3, z: 6 }); // 7
```

## Точки

Точки описываются простыми объектами:

```ts
import type { Vector2, Vector3 } from '@peetland/geometry';

const onMap: Vector2 = { x: 10, y: 20 };
const inWorld: Vector3 = { x: 10, y: 20, z: 5 };
```

Высота — это ось `z`, а плоскость `x`/`y` — земля. Поэтому любую `Vector3` можно передать туда, где
ожидается `Vector2`: высота в этом случае просто не учитывается.

## Расстояние между точками

`getDistance2d` измеряет расстояние по земле, `getDistance3d` — по прямой в пространстве:

```ts
const from = { x: 0, y: 0, z: 0 };
const to = { x: 3, y: 4, z: 12 };

geometry.getDistance2d(from, to); // 5
geometry.getDistance3d(from, to); // 13
```

Порядок аргументов не важен: расстояние от `from` до `to` и обратно всегда одинаковое.

## Попадание в радиус

`isWithinRadius2d` и `isWithinRadius3d` проверяют, находится ли точка не дальше заданного радиуса от
центра. Точка ровно на границе считается попавшей в радиус.

```ts
const door = { x: 0, y: 0, z: 0 };
const balcony = { x: 1, y: 1, z: 8 };

geometry.isWithinRadius2d(balcony, door, 2); // true — по земле балкон рядом
geometry.isWithinRadius3d(balcony, door, 2); // false — но он высоко
```

Какую из них выбрать, зависит от задачи. Если высота точек может немного различаться, а важно
только, дошёл ли кто-то до места, используйте `isWithinRadius2d`. Если высота имеет значение,
например, нужно отличать первый этаж от крыши, используйте `isWithinRadius3d`.

## Перемещение к цели

`moveTowards` возвращает новую точку, сдвинутую от текущей в сторону цели не больше чем на
`maxDistance`. Если до цели ближе, возвращается сама цель, так что точка никогда её не проскакивает.

```ts
const current = { x: 0, y: 0, z: 0 };
const target = { x: 10, y: 0, z: 0 };

geometry.moveTowards(current, target, 3); // { x: 3, y: 0, z: 0 }
geometry.moveTowards(current, target, 50); // { x: 10, y: 0, z: 0 }
```

Обычно `moveTowards` вызывают раз за раз, пока точка не дойдёт до цели. Шаг удобно считать как
скорость, умноженную на время, прошедшее с прошлого вызова, — тогда скорость движения не зависит от
того, как часто происходит вызов:

```ts
const speed = 1.5; // метров в секунду
let position = { x: 0, y: 0, z: 0 };

function update(deltaSeconds: number) {
  position = geometry.moveTowards(position, target, speed * deltaSeconds);
}
```

Переданные точки не изменяются: результат всегда новый объект.

## Углы

Углы задаются в градусах: 0° — север (`+y`), угол растёт против часовой
стрелки. 90° — запад (`−x`), 180° — юг (`−y`), 270° — восток (`+x`).

Это не та система, что в математике, где 0° — восток. Поэтому `Math.atan2(dy, dx)` напрямую для
таких углов не подходит.

### Нормализация угла

Один и тот же поворот можно записать разными числами: −10°, 350° и 710° — это одно направление.
`normalizeAngle` приводит угол к диапазону [0, 360):

```ts
geometry.normalizeAngle(-10); // 350
geometry.normalizeAngle(450); // 90
geometry.normalizeAngle(360); // 0
```

### Угол на точку

`getAngleTo` возвращает направление из точки `from` на точку `to`: угол, на который должен быть
повёрнут тот, кто стоит в `from`, чтобы смотреть на `to`. Это абсолютный угол, и от того, куда
сейчас повёрнут стоящий в `from`, он не зависит. Высота не учитывается, результат всегда в
диапазоне [0, 360):

```ts
const actor = { x: 0, y: 0, z: 0 };

geometry.getAngleTo(actor, { x: 0, y: 10, z: 0 }); // 0 — цель на севере
geometry.getAngleTo(actor, { x: -10, y: 0, z: 0 }); // 90 — цель на западе
geometry.getAngleTo(actor, { x: 10, y: 0, z: 0 }); // 270 — цель на востоке
```

Если точки совпадают, направления нет, и возвращается 0.

### Достижение угла

`isWithinAngle` проверяет, что угол отличается от целевого не больше чем на `tolerance`. Разница
считается по кратчайшему пути, с учётом перехода через 0°/360°:

```ts
geometry.isWithinAngle(100, 90, 15); // true
geometry.isWithinAngle(350, 5, 15); // true — между 350° и 5° всего 15°
geometry.isWithinAngle(340, 5, 15); // false — 25°
```

Если `tolerance` не передан, он равен 0: углы должны совпадать.

Отрицательные углы и углы больше 360° тоже можно передавать: −10° и 350° считаются одним углом.

Обычно эти методы используют вместе: чтобы повернуть кого-то к цели, считают нужный угол через
`getAngleTo`, а через `isWithinAngle` проверяют, повернулся ли он:

```ts
const target = geometry.getAngleTo(actor.getPosition(), trash.getPosition());
const isFacing = geometry.isWithinAngle(actor.getAngle(), target, 15);
```

## Зависимость от интерфейса

Если ваш класс использует геометрию, принимайте её через интерфейс `IGeometry`, а не создавайте
внутри. Так в тестах её можно подменить, а при необходимости — заменить реализацию целиком:

```ts
import type { IGeometry, Vector3 } from '@peetland/geometry';

class Guard {
  constructor(
    private readonly geometry: IGeometry,
    private readonly post: Vector3
  ) {}

  isOnPost(position: Vector3): boolean {
    return this.geometry.isWithinRadius2d(position, this.post, 1);
  }
}

const guard = new Guard(new Geometry(), { x: 100, y: 200, z: 10 });
```
