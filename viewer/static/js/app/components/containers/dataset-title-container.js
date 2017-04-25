import React from 'react';
import { connect } from 'react-redux';

import DatasetTitle from '../views/dataset-title';


class DatasetTitleContainer extends React.Component {
  render() {
    return <DatasetTitle {...this.props } />;
  }
}

const mapStateToProps = function(store) {
  return {
    currentDataset: store.datasetState.currentDataset,
  };
};

export default connect(mapStateToProps)(DatasetTitleContainer);
