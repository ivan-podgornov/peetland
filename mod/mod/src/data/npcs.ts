import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import { NpcKind } from '@peetland/npc';
import type { NpcData } from '@peetland/npc';
import { Feeling, Trait } from '@peetland/psyche';

export const npcs: NpcData[] = [
  {
    id: 'peet',
    kind: NpcKind.Homeless,
    modelId: 230,
    // Вход в бомжарню (см. montgomery-homeless-camp в местах)
    spawnPosition: {
      x: 1271.41,
      y: 181.76,
      z: 19.44,
    },
    spawnAngle: 242,
    psyche: {
      traits: {
        [Trait.Conscientiousness]: 100,
        [Trait.Luck]: 50,
        [Trait.Optimism]: 50,
      },
      feelings: {
        [Feeling.Shame]: 0,
      },
    },
    // Денег ровно на «Ромашку», а голод срочный: бомж сразу идёт её купить и съесть, а потом без
    // денег и пойла идёт собирать бутылки
    inventory: {
      [Item.Money]: 80,
    },
    needs: {
      [Need.Satiety]: 20,
    },
  },
];
