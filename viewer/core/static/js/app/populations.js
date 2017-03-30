export default class {
  constructor() {
    this.populations = [
      {key: 'All', name: 'All records'},
      {key: 'channel:release', name: 'Release update channel'},
      {key: 'channel:beta', name: 'Beta update channel'},
      {key: 'channel:aurora', name: 'Aurora update channel'},
      {key: 'channel:nightly', name: 'Nightly update channel'},
      {key: 'os:windows', name: 'Windows operating system'},
      {key: 'os:darwin', name: 'Mac OS X operating system'},
      {key: 'os:linux', name: 'Linux operating system'},
    ];
  }

  /**
   * Return an array of population objects, where each population object has a
   * key and a name. For example:
   *
   * [
   *   {key: 'All', name: 'All records'}
   * ]
   *
   * @returns {Array} An array of population objects
   */
  getPopulations() {
    return this.populations;
  }

  /**
   * Check whether a population with the given key exists
   *
   * @param {String} populationKey A possible population key. For example,
   *                               channel:release.
   * @returns true if a population with the given key exists, otherwise false
   */
  isPopulation(populationKey) {
    return this.populations.some(currentElement => currentElement.key === populationKey);
  }
}
