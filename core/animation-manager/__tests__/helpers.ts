import { createAnimationManager, ManualAnimationLoader } from '../dev';
import type { AnimationManager, AnimationTable, IAnimationLoader } from '../src';

/** Анимация для тестов менеджера анимаций. Анимации одной группы загружаются одной загрузкой */
export type TestAnimation = {
  duration: number;
  group: string;
};

/** Таблица анимаций для тестов: у pay и item-give одна группа, у остальных — своя */
export const TEST_ANIMATIONS: AnimationTable<TestAnimation> = {
  'trash-search-start': { duration: 1000, group: 'trash-search-start' },
  'trash-search': { duration: 2000, group: 'trash-search' },
  'trash-search-look-1': { duration: 2000, group: 'trash-search-look-1' },
  'trash-search-look-2': { duration: 3000, group: 'trash-search-look-2' },
  'trash-search-pocket': { duration: 2330, group: 'trash-search-pocket' },
  'trash-search-end': { duration: 1330, group: 'trash-search-end' },
  'beg-sitting': { duration: 3500, group: 'beg-sitting' },
  'item-give': { duration: 5330, group: 'money' },
  'item-receive': { duration: 5330, group: 'item-receive' },
  pay: { duration: 4670, group: 'money' },
  'drink-standing-1': { duration: 2330, group: 'drink-standing-1' },
  'drink-standing-2': { duration: 2330, group: 'drink-standing-2' },
};

/** Создаёт загрузчик, который загружает группу анимаций, только когда это скажет тест */
export function createManualLoader(): ManualAnimationLoader<TestAnimation> {
  return new ManualAnimationLoader({ key: (animation) => animation.group });
}

/** Создаёт менеджер анимаций с TEST_ANIMATIONS и переданным загрузчиком */
export function createTestAnimationManager(
  loader: IAnimationLoader<TestAnimation> = createManualLoader()
): AnimationManager<TestAnimation> {
  return createAnimationManager(TEST_ANIMATIONS, loader);
}
