import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ChartConfig from '../views/chart-config';
import * as metricApi from '../../api/metric-api';
import Populations from '../../populations';


class ChartConfigContainer extends React.Component {
  constructor(props) {
    super(props);
    const populations = new Populations();
    this.populationList = populations.getPopulations();
  }

  componentDidMount() {
    metricApi.getMetricMetadata();
  }

  _handleSubmit(e) {
    var metrics = Array.from(
      document.querySelectorAll('input.cb-metrics:checked'),
      input => input.value
    ).join(',');

    var pops = Array.from(
      document.querySelectorAll('input.cb-pops:checked'),
      input => input.value
    ).join(',');

    var qs = [];
    if (metrics) {
      qs.push(`metrics=${metrics}`);
    }
    if (pops) {
      qs.push(`pop=${pops}`);
    }

    if (qs.length) {
      browserHistory.push('/?' + qs.join('&'));
    } else {
      browserHistory.push('/');
    }
  }

  render() {
    return (
      <ChartConfig {...this.props}
        populationList={this.populationList}
        handleSubmit={this._handleSubmit} />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    metadata: store.metricMetadataState.metadata
  };
};

export default connect(mapStateToProps)(ChartConfigContainer);
