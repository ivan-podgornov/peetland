import type { AnimationId } from '@peetland/game';

/** Анимация GTA SA */
export type GtaAnimation = {
  /** Блок анимаций — IFP-файл, в котором лежит анимация */
  block: string;
  /** Название анимации внутри блока */
  name: string;
  /**
   * Сколько длится один проход анимации, в миллисекундах. Зацикленные анимации вместо этого
   * проигрываются столько, сколько передали в playAnimation
   */
  duration: number;
};

/** Блок, который всегда загружен в игре. Его не нужно загружать перед проигрыванием анимации */
export const ALWAYS_LOADED_BLOCK = 'PED';

/**
 * Анимации GTA SA, которыми показываются анимации актора. Прямых анимаций для части действий в
 * игре нет, поэтому подобраны похожие
 */
export const GTA_ANIMATIONS: Record<AnimationId, GtaAnimation> = {
  'trash-search-start': { block: 'INT_SHOP', name: 'shop_in', duration: 1000 },
  'trash-search': { block: 'INT_SHOP', name: 'shop_loop', duration: 2000 },
  'trash-search-look-1': { block: 'INT_SHOP', name: 'shop_lookA', duration: 2000 },
  'trash-search-look-2': { block: 'INT_SHOP', name: 'shop_lookB', duration: 3000 },
  'trash-search-pocket': { block: 'INT_SHOP', name: 'shop_shelf', duration: 2330 },
  'trash-search-end': { block: 'INT_SHOP', name: 'shop_out', duration: 1330 },
  'beg-sitting': { block: 'CRACK', name: 'crckidle1', duration: 3500 },
  'item-give': { block: 'KISSING', name: 'gift_give', duration: 5330 },
  'item-receive': { block: 'KISSING', name: 'gift_get', duration: 5330 },
  pay: { block: 'DEALER', name: 'shop_pay', duration: 4670 },
  'drink-standing-1': { block: 'BAR', name: 'dnk_stndM_loop', duration: 2330 },
  'drink-standing-2': { block: 'BAR', name: 'dnk_stndF_loop', duration: 2330 },
};
