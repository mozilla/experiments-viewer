export function debounce(fn, wait = 250) {
  let timeout;

  return function() {
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function toggleConfigurationModal(forceClose) {
  if (document.body.classList.contains('configuration-open') || (typeof forceClose === 'boolean' && forceClose)) {
    document.body.classList.remove('configuration-open');
  } else {
    document.body.classList.add('configuration-open');
  }
}

// Array of metric types that will require an ordinal scale (categorical x-axis).
const ordinalTypes = [
  'EnumeratedHistogram',
  'BooleanHistogram',
  'ExponentialHistogram',
];

export function isMetricOrdinal(metricType) {
  return ordinalTypes.indexOf(metricType) > -1;
}

/**
 * Return a new sorted array, except with one value bumped to the front. This
 * function does not sort an array in place; a new array is returned.
 *
 * For example:
 *
 * > bumpSort(['group B', 'group A', 'group C', 'control'], 'control');
 * ['control', 'group A', 'group B', 'group C']
 */
export function bumpSort(array, valueToBump) {
  const arrayCopy = array.slice();
  const valueIndex = arrayCopy.indexOf(valueToBump);

  if (valueIndex === -1) return arrayCopy.sort();

  const arrayOfBumped = arrayCopy.splice(valueIndex, 1);
  return arrayOfBumped.concat(arrayCopy.sort());
}
