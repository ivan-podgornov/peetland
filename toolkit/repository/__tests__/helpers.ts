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

export const mockedPlace: Place = {
  id: 'place',
  type: PlaceType.TrashBin,
  capacity: 1,
  isOpen: true,
  position: { x: 0, y: 0, z: 0 },
};

/** Возвращает новую запись, не связанную с переданной, в том числе по вложенным объектам */
export function createPlace(place: Place): Place {
  return { ...place, position: { ...place.position } };
}
