import type { VirtualAnimations } from './actor';

/**
 * Анимации виртуального актора с длительностями, как у анимаций игры. Для зацикленных анимаций
 * указана длительность одного прохода
 */
export const VIRTUAL_ANIMATIONS: VirtualAnimations = {
  'trash-search-start': { duration: 1000 },
  'trash-search': { duration: 2000 },
  'trash-search-look-1': { duration: 2000 },
  'trash-search-look-2': { duration: 3000 },
  'trash-search-pocket': { duration: 2330 },
  'trash-search-end': { duration: 1330 },
  'beg-sitting': { duration: 3500 },
  'item-give': { duration: 5330 },
  'item-receive': { duration: 5330 },
  pay: { duration: 4670 },
  'drink-standing-1': { duration: 2330 },
  'drink-standing-2': { duration: 2330 },
};
