import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import ChartDetail from '../components/views/chart-detail';

describe('ChartDetail', () => {
  it('The toggleOutliers function should be called every time the "Show outliers" checkbox is changed', () => {
    const numChanges = 3;
    const toggleOutliersSpy = sinon.spy();
    const cd = shallow(<ChartDetail offerOutliersToggle={true} toggleOutliers={toggleOutliersSpy} />);
    const showOutliersCheckbox = cd.find('.show-outliers input[type="checkbox"]');

    for (let i = 0; i < numChanges; i++) {
      showOutliersCheckbox.simulate('change');
    }

    expect(toggleOutliersSpy.callCount).toBe(numChanges);
  });
});
