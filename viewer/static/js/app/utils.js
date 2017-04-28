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
  'C', // TODO: This is for the incorrect fixtures and will go away.
];

export function isMetricOrdinal(metricType) {
  return ordinalTypes.indexOf(metricType) > -1;
}
