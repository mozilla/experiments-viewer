import { getWhitelistedPopulations } from '../api/metric-api';

describe('metric-api', () => {
  it('getWhitelistedPopulations does not return invalid populations', () => {
    const dummyLocation = {
      query: {
        pop: 'fake:population,All,channel:release,os:darwin,another:fake,os:linux,final:fake',
      },
    };

    const whitelistedPopulations = getWhitelistedPopulations(dummyLocation);

    expect(whitelistedPopulations).toEqual(['All', 'channel:release', 'os:darwin', 'os:linux']);
  });
});
