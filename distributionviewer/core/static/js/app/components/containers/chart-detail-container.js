import React from 'react';
import { connect } from 'react-redux';

import ChartDetail from '../views/chart-detail';


function ChartDetailContainer(props) {
  return (
    <ChartDetail {...props} />
  );
}

const mapStateToProps = function(store) {
  return {
    item: store.metricState.item
  };
};

export default connect(mapStateToProps)(ChartDetailContainer);
