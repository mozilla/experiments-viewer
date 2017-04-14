export function debounce(fn, wait = 250) {
  let timeout;

  return function() {
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function toggleConfigurationModal(evt) {
  /*
  if (evt.target.classList.contains('configuration-mask')) {
    document.body.classList.remove('configuration-open');
  }
  */
  document.body.classList.toggle('configuration-open');
}
