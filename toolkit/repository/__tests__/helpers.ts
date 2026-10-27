export enum PlaceType {
  TrashBin = 'trash-bin',
  Shop = 'shop',
}

export type Place = {
  id: string;
  type: PlaceType;
  capacity: number;
  isOpen: boolean;
  position: { x: number; y: number; z: number };
};

export function createPlace(overrides: Partial<Place> = {}): Place {
  return {
    id: 'place',
    type: PlaceType.TrashBin,
    capacity: 1,
    isOpen: true,
    position: { x: 0, y: 0, z: 0 },
    ...overrides,
  };
}
