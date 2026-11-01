import { Item } from '@peetland/inventory';
import type { NpcData } from '@peetland/world';

export const npcs: NpcData[] = [
  {
    id: 'peet',
    modelId: 230,
    // Вход в бомжарню (см. montgomery-homeless-camp в местах)
    spawnPosition: { x: 1271.41, y: 181.76, z: 19.44 },
    spawnAngle: 242,
    traits: {
      conscientiousness: 100,
    },
    feelings: {
      shame: 0,
    },
    inventory: {
      [Item.Money]: 150,
    },
  },
];
