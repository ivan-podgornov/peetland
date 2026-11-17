import { vi } from 'vitest';

import { ItemClassifier } from '../src';
import type { IItemClassifier } from '../src';

/** Создаёт настоящий классификатор, методы которого обёрнуты шпионами vitest */
export function createSpiedItemClassifier(): IItemClassifier {
  const classifier = new ItemClassifier();
  vi.spyOn(classifier, 'isFood');

  return classifier;
}
