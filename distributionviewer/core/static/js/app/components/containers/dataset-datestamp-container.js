import React from 'react';
import { connect } from 'react-redux';

import DatasetDatestamp from '../views/dataset-datestamp';


export class DatasetDatestampContainer extends React.Component {
  // In chart listings, all charts belong to the same dataset, so there's no
  // need to re-render this component every time one is retrieved.
  shouldComponentUpdate() {
    return this.gotDataset ? false : true;
  }

  render() {
    if (this.props.item.dataSet) {
      this.gotDataset = true;
      return (
        <DatasetDatestamp isoDate={this.props.item.dataSet} />
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = function(store) {
  return {
    item: store.metricState.item
  };
};

export default connect(mapStateToProps)(DatasetDatestampContainer);
