import Populations from '../populations';


const populations = new Populations();

describe('Populations', () => {
  it('getPopulations', () => {
    const populationList = populations.getPopulations();

    // Verify that some expected populations exist in the array that is returned
    // from getPopulations. These values will need to change if populations ever
    // change.
    expect(populationList.some(e => e.key === 'All')).toBeTruthy();
    expect(populationList.some(e => e.key === 'channel:release')).toBeTruthy();
    expect(populationList.some(e => e.key === 'os:darwin')).toBeTruthy();
    expect(populationList.some(e => e.key === 'os:linux')).toBeTruthy();
  });

  it('isPopulation', () => {
    // Verify that isPopulation returns true for some populations that we know
    // exist. These values will need to change if populations ever change.
    expect(populations.isPopulation('All')).toBeTruthy();
    expect(populations.isPopulation('channel:release')).toBeTruthy();
    expect(populations.isPopulation('os:darwin')).toBeTruthy();
    expect(populations.isPopulation('os:linux')).toBeTruthy();

    expect(populations.isPopulation('definitelynotapopulation')).toBeFalsy();
  });
});
