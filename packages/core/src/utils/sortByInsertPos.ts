import { InsertPos } from '../types';

export function sortByInsertPos<
  T extends Array<{
    position: InsertPos;
  }>
>(array: T): T {
  return ([...array] as T).sort((left, right) => {
    if (left.position < right.position) {
      return 1;
    }

    if (left.position > right.position) {
      return -1;
    }

    return 0;
  });
}
