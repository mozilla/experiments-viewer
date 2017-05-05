import React from 'react';
import { connect } from 'react-redux';

import DatasetControl from '../views/dataset-control';
import * as urlApi from '../../api/url-api';
import store from '../../store';
import * as datasetActions from '../../actions/dataset-actions';


class DatasetControlContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {currentDatasetId: props.datasetId};

    this._handleApplyButton = this._handleApplyButton.bind(this);
    this._handleDatasetSelection = this._handleDatasetSelection.bind(this);
    this.isBtnDisabled = true;
  }

  _handleDatasetSelection(evt) {
    const activeDataset = store.getState().datasetState.currentDataset.id;
    const selectedDatasetId = parseInt(evt.target.parentNode.querySelector('.dataset-selection').value, 10);

    store.dispatch(datasetActions.selectDatasetUI(selectedDatasetId));

    // sets the apply button disabled state
    if (selectedDatasetId !== activeDataset) {
      this.isBtnDisabled = false;
    } else {
      this.isBtnDisabled = true;
    }
  }

  _handleApplyButton(evt) {
    const selectedDatasetId = parseInt(evt.target.parentNode.querySelector('.dataset-selection').value, 10);
    urlApi.updateQueryParameter('ds', selectedDatasetId);
    urlApi.updateQueryParameter('pop', 'ALL');
    this.isBtnDisabled = true;
  }

  // elm = switch parent element = '.switch-wrapper'
  // available but curently unused.
  _handleCohortSwitch(elm) {
    const selectedPopulations = Array.from(
      document.body.querySelectorAll('.dataset-cohorts .switch.active')
    ).map(sp => sp.parentNode.textContent);
    urlApi.updateQueryParameter('pop', selectedPopulations.join(','));
  }

  render() {
    return (
      <DatasetControl
        {...this.props}

        handleApplyButton={this._handleApplyButton}
        handleDatasetSelection={this._handleDatasetSelection}
        handleCohortSwitch={this._handleCohortSwitch}
        isBtnDisabled={this.isBtnDisabled}

        currentDatasetId={this.props.selectedDatasetId}
      />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    datasets: store.datasetState.datasets,
    currentDataset: store.datasetState.currentDataset,
    selectedDatasetId: store.datasetState.selectedDatasetId
  };
};

export default connect(mapStateToProps)(DatasetControlContainer);
