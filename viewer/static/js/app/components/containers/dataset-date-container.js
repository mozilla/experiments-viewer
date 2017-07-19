import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateFormat';

import DatasetDate from '../views/dataset-date';


class DatasetDateContainer extends React.Component {
  render() {
    return <DatasetDate {...this.props } />;
  }
}

const mapStateToProps = function(store) {
  return {
    date: dateFormat(new Date(store.datasetState.currentDataset.date), 'longDate', true),
  };
};

export default connect(mapStateToProps)(DatasetDateContainer);
