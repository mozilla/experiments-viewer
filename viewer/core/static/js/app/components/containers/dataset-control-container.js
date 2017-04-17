import React from 'react';
import { connect } from 'react-redux';

import DatasetControl from '../views/dataset-control';
import * as urlApi from '../../api/url-api';
import * as datasetApi from '../../api/dataset-api';
import * as datasetActions from '../../actions/dataset-actions';
import store from '../../store';


class DatasetControlContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleDatasetChange = this.handleDatasetChange.bind(this);
  }

  componentDidMount() {
    datasetApi.getDatasets();
  }

  render() {
    return <DatasetControl handleDatasetChange={this.handleDatasetChange} {...this.props} />;
  }

  handleDatasetChange(evt) {
    let currentDataset = {};
    urlApi.updateQueryParameter('ds', evt.target.parentNode.querySelector('.dataset-selection').value);
  }
}

const mapStateToProps = function(store) {
  return {
    datasets: store.datasetState.datasets,
    currentDataset: store.datasetState.currentDataset,
  };
};

export default connect(mapStateToProps)(DatasetControlContainer);
