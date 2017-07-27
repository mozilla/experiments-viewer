import * as utils from '../../utils';

describe('utils.js', () => {
  describe('bumpSort', () => {
    it ('numbers', () => {
      const arr = [5, 9, 3, 2, 8];
      const arrSorted = utils.bumpSort(arr, 8);
      expect(arrSorted).toEqual([8, 2, 3, 5, 9]);
    });

    it ('strings', () => {
      const populations = {'group B': {}, 'group A': {}, 'group C': {}, 'control': {}};
      const sortedPopulations = utils.bumpSort(Object.keys(populations), 'control');
      expect(sortedPopulations).toEqual(['control', 'group A', 'group B', 'group C']);

      const names = ['brittany', 'alex', 'zoey', 'joe', 'kate'];
      const namesSorted = utils.bumpSort(names, 'joe');
      expect(namesSorted).toEqual(['joe', 'alex', 'brittany', 'kate', 'zoey']);
    });

    it ('bumping a value that appears more than once', () => {
      const arr = [1, 5, 5, 2, 3];
      const arrSorted = utils.bumpSort(arr, 5);
      expect(arrSorted).toEqual([5, 1, 2, 3, 5]);
    });

    it ('array without chosen element', () => {
      const arr = [9, 6, 3, 2, 4];
      const arrSorted = utils.bumpSort(arr, 8);
      expect(arrSorted).toEqual([2, 3, 4, 6, 9]);
    });
  });
});
