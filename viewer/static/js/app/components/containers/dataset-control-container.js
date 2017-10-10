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

    this._handleDatasetSelection = this._handleDatasetSelection.bind(this);
  }

  _handleDatasetSelection(evt) {
    const selectedDataset = evt.target.parentNode.querySelector('.dataset-selection').value;

    store.dispatch(datasetActions.selectDatasetUI(selectedDataset));

    // Force window refresh with updated query params (modern browser suppport only).
    if ('URLSearchParams' in window) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('ds', selectedDataset);
      searchParams.set('pop', 'ALL');
      window.location.search = searchParams.toString();
    } else {
      urlApi.updateQueryParameter('ds', selectedDataset);
      urlApi.updateQueryParameter('pop', 'ALL');
    }
  }

  _handleSubgroupSelection(evt) {
    const newSubgroup = evt.target.value || '';
    store.dispatch(datasetActions.changeSubgroup(newSubgroup));
    urlApi.updateQueryParameter('sg', newSubgroup);
  }

  // elm = switch parent element = '.switch-wrapper'
  // available but curently unused.
  _handleCohortSwitch(elm) {
    const selectedPopulations = Array.from(
      document.body.querySelectorAll('.dataset-populations .switch.active')
    ).map(sp => sp.parentNode.textContent);
    urlApi.updateQueryParameter('pop', selectedPopulations.join(','));
  }

  render() {
    return (
      <DatasetControl
        {...this.props}

        handleDatasetSelection={this._handleDatasetSelection}
        handleSubgroupSelection={this._handleSubgroupSelection}
        handleCohortSwitch={this._handleCohortSwitch}
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
