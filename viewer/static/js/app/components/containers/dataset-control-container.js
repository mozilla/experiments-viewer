import React from 'react';
import { connect } from 'react-redux';

import DatasetControl from '../views/dataset-control';
import * as urlApi from '../../api/url-api';
import store from '../../store';
import * as datasetActions from '../../actions/dataset-actions';


class DatasetControlContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {currentDataset: props.dataset};

    this._handleApplyButton = this._handleApplyButton.bind(this);
    this._handleDatasetSelection = this._handleDatasetSelection.bind(this);
    this.isBtnDisabled = true;
  }

  _handleDatasetSelection(evt) {
    const activeDataset = store.getState().datasetState.currentDataset.name;
    const selectedDataset = evt.target.parentNode.querySelector('.dataset-selection').value;

    store.dispatch(datasetActions.selectDatasetUI(selectedDataset));

    // sets the apply button disabled state
    if (selectedDataset !== activeDataset) {
      this.isBtnDisabled = false;
    } else {
      this.isBtnDisabled = true;
    }
  }

  _handleSubgroupSelection(evt) {
    const newSubgroup = evt.target.value || '';
    store.dispatch(datasetActions.changeSubgroup(newSubgroup));
    urlApi.updateQueryParameter('sg', newSubgroup);
  }

  _handleApplyButton(evt) {
    const selectedDataset = evt.target.parentNode.querySelector('.dataset-selection').value;
    urlApi.updateQueryParameter('ds', selectedDataset);
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
        handleSubgroupSelection={this._handleSubgroupSelection}
        handleCohortSwitch={this._handleCohortSwitch}
        isBtnDisabled={this.isBtnDisabled}

        currentDataset={this.props.selectedDataset}
      />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    datasets: store.datasetState.datasets,
    currentDataset: store.datasetState.currentDataset,
    selectedDataset: store.datasetState.selectedDataset
  };
};

export default connect(mapStateToProps)(DatasetControlContainer);
