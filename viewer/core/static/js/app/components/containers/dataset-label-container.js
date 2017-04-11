import React from 'react';
import { connect } from 'react-redux';

import DatasetLabel from '../views/dataset-label';


class DatasetLabelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.gotDatasetName = false;
  }

  shouldComponentUpdate() {
    return this.gotDatasetName ? false : true;
  }

  render() {
    // All metrics coming from the API should belong to the same dataset, so we
    // only need to grab the dataset name of the first one.
    const firstMetric = this.props.metrics[Object.keys(this.props.metrics)[0]];
    if (firstMetric) {
      this.gotDatasetName = true;
      return <DatasetLabel datasetName={firstMetric.dataSet} />;
    } else {
      return null;
    }
  }
}

const mapStateToProps = function(store) {
  return {
    metrics: store.metricState.metrics,
  };
};

export default connect(mapStateToProps)(DatasetLabelContainer);
