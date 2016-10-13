import React from 'react';
import { connect } from 'react-redux';

import ChartMenu from '../views/chart-menu';


function ChartMenuContainer(props) {
  return (
    <ChartMenu metadata={props.metadata} />
  );
}

const mapStateToProps = function(store) {
  return {
    metadata: store.metricMetadataState.metadata,
  };
}

export default connect(mapStateToProps)(ChartMenuContainer);
