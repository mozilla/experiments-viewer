import React from 'react';

import Configuration from '../views/configuration';
import * as utils from '../../utils';
import * as urlApi from '../../api/url-api';


export default class extends React.Component {
  constructor(props) {
    super(props);

    this.configureSubgroupsClass = 'configure-subgroups';
    this.configureChartsClass = 'configure-charts';

    this._handleModifyCharts = this._handleModifyCharts.bind(this);
  }

  componentDidMount() {
    // Press 'h' to show the config menu - for ease of access.
    document.body.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 72) {
        utils.toggleConfigurationModal();
      }
    }, false);
  }

  _csvSelectedCheckboxValues(fieldsetClass) {
    const selectedCheckboxes = document.querySelectorAll(`.${fieldsetClass} input[type="checkbox"]:checked`);
    const selectedValues = Array.from(selectedCheckboxes, sc => sc.value);
    return selectedValues.join(',');
  }

  _handleModifyOutliers(event) {
    urlApi.updateQueryParameter('showOutliers', event.target.checked);
  }

  _handleModifyScale(event) {
    urlApi.updateQueryParameter('scale', event.target.value)
  }

  _handleModifyCharts(event) {
    const csvSelectedMetricIds = this._csvSelectedCheckboxValues(this.configureChartsClass);
    urlApi.updateQueryParameter('metrics', csvSelectedMetricIds);
  }

  render() {
    return (
      <Configuration
        {...this.props}

        handleModifyOutliers={this._handleModifyOutliers}
        handleModifyScale={this._handleModifyScale}
        handleModifyCharts={this._handleModifyCharts}

        configureChartsClass={this.configureChartsClass}
        configureSubgroupsClass={this.configureSubgroupsClass}
      />
    );
  }
}
