import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ChartConfig from '../views/chart-config';
import * as metricApi from '../../api/metric-api';


class ChartConfigContainer extends React.Component {
  constructor(props) {
    super(props);
    this.whitelistedMetricIds = metricApi.getWhitelistedMetricIds(props.location);
  }

  componentDidMount() {
    metricApi.getMetricMetadata();
  }

  _handleSubmit(e) {
    var metrics = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked'),
      input => input.value
    ).join(',');

    if (metrics) {
      browserHistory.push(`/?metrics=${metrics}`);
    }
  }

  render() {
    return (
      <ChartConfig {...this.props} whitelistedMetricIds={this.whitelistedMetricIds} handleSubmit={this._handleSubmit} />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    metadata: store.metricMetadataState.metadata
  };
};

export default connect(mapStateToProps)(ChartConfigContainer);
