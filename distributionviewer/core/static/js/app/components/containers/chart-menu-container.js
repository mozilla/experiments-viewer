import React from 'react';
import { connect } from 'react-redux';

import ChartMenu from '../views/chart-menu';


function ChartMenuContainer(props) {
  return (
    <ChartMenu items={props.items} />
  );
}

const mapStateToProps = function(store) {
  return {
    isFetching: store.metricState.isFetching,
    items: store.metricState.items,
    status: store.metricState.status
  };
}

export default connect(mapStateToProps)(ChartMenuContainer);
