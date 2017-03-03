import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import * as metricApi from '../../api/metric-api';
import Configuration from '../views/configuration';
import Populations from '../../populations';


class ConfigurationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.configurePopulationsClass = 'configure-populations';
    this.configureChartsClass = 'configure-charts';

    if (props.configurePopulations) {
      const populations = new Populations();
      this.populationObjects = populations.getPopulations();
    }

    this._updateQueryParameter = this._updateQueryParameter.bind(this);
    this._handleModifyOutliers = this._handleModifyOutliers.bind(this);
    this._handleModifyScale = this._handleModifyScale.bind(this);
    this._handleModifyPopulations = this._handleModifyPopulations.bind(this);
    this._handleModifyCharts = this._handleModifyCharts.bind(this);
  }

  componentDidMount() {
    if (this.props.configureCharts) {
      metricApi.getMetricMetadata();
    }
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

  _handleModifyPopulations(event) {
    const csvSelectedPopulations = this._csvSelectedCheckboxValues(this.configurePopulationsClass);
    this._updateQueryParameter('pop', csvSelectedPopulations);
  }

  _handleModifyCharts(event) {
    const csvSelectedMetricIds = this._csvSelectedCheckboxValues(this.configureChartsClass);
    this._updateQueryParameter('metrics', csvSelectedMetricIds);
  }

  render() {
    return (
      <Configuration
        populationObjects={this.populationObjects}
        metricMetadata={this.props.metricMetadata}

        handleModifyOutliers={this._handleModifyOutliers}
        handleModifyScale={this._handleModifyScale}
        handleModifyPopulations={this._handleModifyPopulations}
        handleModifyCharts={this._handleModifyCharts}

        configureChartsClass={this.configureChartsClass}
        configurePopulationsClass={this.configurePopulationsClass}

        {...this.props}
      />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    metricMetadata: store.metricMetadataState.metadata
  };
};

export default connect(mapStateToProps)(ConfigurationContainer);
