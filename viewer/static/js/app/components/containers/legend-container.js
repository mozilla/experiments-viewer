import React from 'react';
import { connect } from 'react-redux';

import Legend from '../views/legend';


class LegendContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Legend {...this.props} populations={this.props.populations} />;
  }
}

const mapStateToProps = function(store) {
  return {
    populations: store.datasetState.currentDataset.populations,
  };
};

export default connect(mapStateToProps)(LegendContainer);
