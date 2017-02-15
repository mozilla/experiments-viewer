import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ChartConfig from '../views/chart-config';
import * as metricApi from '../../api/metric-api';


class ChartConfigContainer extends React.Component {
  constructor(props) {
    super(props);
    this.populationList = Array(
      {key: 'All', name: 'All records'},
      {key: 'channel:release', name: 'Release update channel'},
      {key: 'channel:beta', name: 'Beta update channel'},
      {key: 'channel:aurora', name: 'Aurora update channel'},
      {key: 'channel:nightly', name: 'Nightly update channel'},
      {key: 'os:windows', name: 'Windows operating system'},
      {key: 'os:darwin', name: 'Mac OS X operating system'},
      {key: 'os:linux', name: 'Linux operating system'});
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
