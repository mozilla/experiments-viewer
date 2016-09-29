import React from 'react';
import { connect } from 'react-redux';

import { ChartMenu } from '../views/chart-menu';


class ChartMenuContainer extends React.Component {
  render() {
    return (
      <ChartMenu items={this.props.items} />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    isFetching: store.metricState.isFetching,
    items: store.metricState.items,
    status: store.metricState.status
  };
}

export default connect(mapStateToProps)(ChartMenuContainer);
