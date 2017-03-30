import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import Configuration from '../components/views/configuration';

describe('Configuration', () => {
  it('The handleModifyOutliers function should be called every time the "Show outliers" checkbox is changed', () => {
    const numChanges = 10;
    const handleModifyOutliers = sinon.spy();
    const c = shallow(
      <Configuration
        configureOutliers={true}
        whitelistedPopulations={['All']}
        handleModifyOutliers={handleModifyOutliers}
      />
    );
    const showOutliersCheckbox = c.find('.configure-outliers input[type="checkbox"]');

    for (let i = 0; i < numChanges; i++) {
      showOutliersCheckbox.simulate('change');
    }

    expect(handleModifyOutliers.callCount).toBe(numChanges);
  });

  it('The handleModifyScale function should be called every time a scale radio button is selected', () => {
    const numChanges = 10;
    const handleModifyScale = sinon.spy();
    const c = shallow(
      <Configuration
        configureScale={true}
        whitelistedPopulations={['All']}
        handleModifyScale={handleModifyScale}
      />
    );

    const linearRadioButton = c.find('.configure-scale .linear');
    const logRadioButton = c.find('.configure-scale .log');

    for (let i = 0; i < numChanges; i++) {
      const even = i % 2 === 0;

      if (even) {
        linearRadioButton.simulate('change');
      } else {
        logRadioButton.simulate('change');
      }
    }

    expect(handleModifyScale.callCount).toBe(numChanges);
  });
});
