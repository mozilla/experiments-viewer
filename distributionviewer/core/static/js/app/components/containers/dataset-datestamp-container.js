import React from 'react';
import { connect } from 'react-redux';

import DatasetDatestamp from '../views/dataset-datestamp';


class DatasetDatestampContainer extends React.Component {
  constructor(props) {
    super(props);
    this.gotDataset = false;
  }

  shouldComponentUpdate() {
    return this.gotDataset ? false : true;
  }

  render() {
    // All metrics coming from the API should belong to the same dataset, so we
    // only need to grab the dataSet property from the first one.
    const firstMetric = this.props.metrics[Object.keys(this.props.metrics)[0]];
    if (firstMetric) {
      this.gotDataset = true;
      return <DatasetDatestamp isoDate={firstMetric.dataSet} />;
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

export default connect(mapStateToProps)(DatasetDatestampContainer);
