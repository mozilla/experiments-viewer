import React from 'react';
import { connect } from 'react-redux';

import DatasetControl from '../views/dataset-control';
import * as urlApi from '../../api/url-api';


class DatasetControlContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {currentDatasetId: props.datasetId};

    this._handleApplyButton = this._handleApplyButton.bind(this);
    this._handleDatasetSelection = this._handleDatasetSelection.bind(this);
  }

  // The dataset select box needs to be a controlled component for us to set the
  // proper default value. Because it's a controlled component, we need to
  // manage its state manually. That's what this function does.
  //
  // https://facebook.github.io/react/docs/forms.html#the-select-tag
  _handleDatasetSelection(evt) {
    const selectedDatasetId = parseInt(evt.target.parentNode.querySelector('.dataset-selection').value, 10);
    this.setState({currentDatasetId: selectedDatasetId});
  }

  _handleApplyButton(evt) {
    const selectedDatasetId = parseInt(evt.target.parentNode.querySelector('.dataset-selection').value, 10);
    urlApi.updateQueryParameter('ds', selectedDatasetId);

    const selectedSubgroups = Array.from(
        evt.target.parentNode.querySelectorAll('.dataset-cohorts .switch.active')
    ).map(ss => ss.parentNode.textContent);
    urlApi.updateQueryParameter('sg', selectedSubgroups.join(','));
  }

  render() {
    return (
      <DatasetControl
        {...this.props}

        handleApplyButton={this._handleApplyButton}
        handleDatasetSelection={this._handleDatasetSelection}

        currentDatasetId={this.state.currentDatasetId}
      />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    datasets: store.datasetState.datasets,
    currentDataset: store.datasetState.currentDataset,
  };
};

export default connect(mapStateToProps)(DatasetControlContainer);
