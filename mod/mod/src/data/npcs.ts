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
      },
      feelings: {
        [Feeling.Shame]: 0,
      },
    },
    // Без денег и пойла: так бомж сразу идёт собирать бутылки
    inventory: {},
  },
];
