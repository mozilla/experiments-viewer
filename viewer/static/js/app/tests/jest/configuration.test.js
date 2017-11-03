import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import sinon from 'sinon';

import Configuration from '../../components/views/configuration';


let outliersSpy, scaleSpy, configurationMock;

Enzyme.configure({ adapter: new Adapter() });

describe('Configuration', () => {
  beforeAll(() => {
    outliersSpy = sinon.spy();
    scaleSpy = sinon.spy();

    configurationMock = Enzyme.shallow(
      <Configuration
        configureOutliers={true}
        configureScale={true}

        handleModifyOutliers={outliersSpy}
        handleModifyScale={scaleSpy}
      />
    );
  });

  it('The handleModifyOutliers function should be called every time the "Show outliers" checkbox is changed', () => {
    const numChanges = 10;
    const showOutliersCheckbox = configurationMock.find('.configure-outliers input[type="checkbox"]');

    for (let i = 0; i < numChanges; i++) {
      showOutliersCheckbox.simulate('change');
    }

    expect(outliersSpy.callCount).toBe(numChanges);
  });

  it('The handleModifyScale function should be called every time a scale radio button is selected', () => {
    const numChanges = 10;

    const linearRadioButton = configurationMock.find('.configure-scale .linear');
    const logRadioButton = configurationMock.find('.configure-scale .log');

    for (let i = 0; i < numChanges; i++) {
      const even = i % 2 === 0;

      if (even) {
        linearRadioButton.simulate('change');
      } else {
        logRadioButton.simulate('change');
      }
    }

    expect(scaleSpy.callCount).toBe(numChanges);
  });
});
