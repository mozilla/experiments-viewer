import React from 'react';
import { connect } from 'react-redux';

import { ChartDetail } from '../views/chart-detail';

class ChartDetailContainer extends React.Component {
  render() {
    return (
      <ChartDetail {...this.props}  />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    item: store.metricState.item,
  };
}

export default connect(mapStateToProps)(ChartDetailContainer);
