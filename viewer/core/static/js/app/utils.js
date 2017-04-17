export function debounce(fn, wait = 250) {
  let timeout;

  return function() {
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function toggleConfigurationModal(forceClose) {
  if (document.body.classList.contains('configuration-open') || forceClose) {
    document.body.classList.remove('configuration-open');
  } else {
    document.body.classList.add('configuration-open');
  }
}
