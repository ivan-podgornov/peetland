import type { PlaceData } from '@peetland/world';
import { PlaceType } from '@peetland/world';

export const places: PlaceData[] = [
  {
    id: 'montgomery-homeless-camp',
    position: { x: 1271.41, y: 181.76, z: 19.44 },
    angle: 0,
    type: PlaceType.HomelessCamp,
  },
  {
    id: 'montgomery-hannibal-liquor-kiosk',
    position: { x: 1321.81, y: 352.54, z: 19.55 },
    angle: 0,
    type: PlaceType.Shop,
  },
  {
    id: 'montgomery-liquor-deli',
    position: { x: 1359.61, y: 205.1, z: 19.75 },
    angle: 0,
    type: PlaceType.Shop,
  },
  {
    id: 'montgomery-hannibal-liquor-kiosk-backdoor',
    position: { x: 1311.13, y: 351.59, z: 19.55 },
    angle: 0,
    type: PlaceType.BottleCollection,
  },
  {
    id: 'montgomery-begging-spot',
    position: { x: 1213.24, y: 296.77, z: 19.55 },
    angle: 0,
    type: PlaceType.BeggingSpot,
  },
  {
    id: 'montgomery-trash-bin-1',
    // У киоска, справа от задней двери
    position: { x: 1314.91, y: 348.57, z: 19.55 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-2',
    // У киоска, слева от задней двери
    position: { x: 1308.07, y: 350.72, z: 19.55 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-3',
    // За рестораном
    position: { x: 1300.07, y: 220.54, z: 19.55 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-4',
    // За торговым центром, который находится справа от ресторана. Мусорка, которая ближе к ресторану
    position: { x: 1320.22, y: 210.51, z: 19.55 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-5',
    // За торговым центром, который находится справа от ресторана. Мусорка, которая дальше от ресторана
    position: { x: 1328.07, y: 206.68, z: 19.55 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-6',
    // Справа от входа в Liquor & Deli, ближе к дороги
    position: { x: 1352.64, y: 204.68, z: 19.55 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-7',
    // Справа от входа в Liquor & Deli, дальше от дороги
    position: { x: 1352.11, y: 201.4, z: 19.55 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-8',
    // Справа от входа в пиццерию, ближе к дороге и входу
    position: { x: 1361.59, y: 231.67, z: 19.56 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-9',
    // Справа от входа в пиццерию, дальше от дороги и входа
    position: { x: 1364.07, y: 230.46, z: 19.56 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
  {
    id: 'montgomery-trash-bin-10',
    // На заправке
    position: { x: 1368.35, y: 483.13, z: 20.02 },
    angle: 0,
    type: PlaceType.TrashBin,
  },
];
