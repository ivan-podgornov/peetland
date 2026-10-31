export type Vector2 = { x: number; y: number };

export type Vector3 = { x: number; y: number; z: number };

export interface IGeometry {
  /** Возвращает дистанцию между двумя точками в двумерном пространстве */
  getDistance2d(pointA: Vector2, pointB: Vector2): number;

  /** Возвращает дистанцию между двумя точками в трёхмерном пространстве */
  getDistance3d(pointA: Vector3, pointB: Vector3): number;

  /**
   * Проверяет, находится ли точка в указанном радиусе от центра на плоскости, без учёта высоты
   * @param point - точка, которую проверяем
   * @param center - точка, относительно которой проверяем радиус
   * @param radius - радиус в котором должна находиться точка
   */
  isWithinRadius2d(point: Vector2, center: Vector2, radius: number): boolean;

  /**
   * Проверяет, находится ли точка в указанном радиусе по отношению к указанному центру
   * @param point - точка, которую проверяем
   * @param center - точка, относительно которой проверяем радиус
   * @param radius - радиус в котором должна находиться точка
   */
  isWithinRadius3d(point: Vector3, center: Vector3, radius: number): boolean;

  /**
   * Возвращает точку, сдвинутую от `current` в сторону `target` на `maxDistance`
   * Если до цели ближе, чем `maxDistance`, возвращает цель
   */
  moveTowards(current: Vector3, target: Vector3, maxDistance: number): Vector3;

  /**
   * Проверяет, что угол отличается от целевого не больше чем на `tolerance`. Углы в градусах.
   * Разница считается по кратчайшему пути, с учётом перехода через 0°/360°: между 350° и 5° — 15°
   * @param angle - угол, который проверяем
   * @param target - угол, к которому должен быть близок `angle`
   * @param tolerance - допустимое отклонение в градусах
   */
  isWithinAngle(angle: number, target: number, tolerance: number): boolean;

  /**
   * Возвращает угол в градусах, на который нужно повернуться из точки `from`, чтобы смотреть на
   * точку `to`. Высота не учитывается. Угол в диапазоне [0, 360) и отсчитывается как в GTA SA:
   * 0° — север (+Y), угол растёт против часовой стрелки, 90° — запад (−X). Если точки совпадают,
   * возвращает 0
   */
  getAngleTo(from: Vector2, to: Vector2): number;
}
