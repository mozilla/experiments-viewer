import React from 'react';
import { browserHistory } from 'react-router';

import Configuration from '../views/configuration';
import * as utils from '../../utils';


export default class extends React.Component {
  constructor(props) {
    super(props);

    this.configureSubgroupsClass = 'configure-subgroups';
    this.configureChartsClass = 'configure-charts';

    this._updateQueryParameter = this._updateQueryParameter.bind(this);
    this._handleModifyOutliers = this._handleModifyOutliers.bind(this);
    this._handleModifyScale = this._handleModifyScale.bind(this);
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

  _updateQueryParameter(key, newValue) {
    const newQuery = Object.assign({}, this.props.location.query, {[key]: newValue});

    browserHistory.push({
      pathname: this.props.location.pathname,
      query: newQuery,
    });
  }

  _handleModifyOutliers(event) {
    this._updateQueryParameter('showOutliers', event.target.checked);
  }

  _handleModifyScale(event) {
    this._updateQueryParameter('scale', event.target.value)
  }

  _handleModifyCharts(event) {
    const csvSelectedMetricIds = this._csvSelectedCheckboxValues(this.configureChartsClass);
    this._updateQueryParameter('metrics', csvSelectedMetricIds);
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
