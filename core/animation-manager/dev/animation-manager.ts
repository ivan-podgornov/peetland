import { AnimationManager, InstantAnimationLoader } from '../src';
import type { AnimationRecord, AnimationTable, IAnimationLoader } from '../src';

/**
 * Создаёт менеджер анимаций с переданной таблицей. Если загрузчик не указан, все анимации
 * загружены сразу
 */
export function createAnimationManager<TAnimation extends AnimationRecord>(
  animations: AnimationTable<TAnimation>,
  loader: IAnimationLoader<TAnimation> = new InstantAnimationLoader()
): AnimationManager<TAnimation> {
  return new AnimationManager({ animations }, { loader });
}
