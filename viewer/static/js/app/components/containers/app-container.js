import React from 'react';
import { connect } from 'react-redux';

import * as metricApi from '../../api/metric-api';
import * as urlApi from '../../api/url-api';
import * as datasetApi from '../../api/dataset-api';
import * as datasetActions from '../../actions/dataset-actions';
import store from '../../store';


/**
 * A container that does groundwork needed by several other components, like
 * processing URL parameters.
 */
class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.currentDataset = {};
    this.sortedPopulationsToShow = [];
    this.fetchedMetadata = false;
  }

  componentWillMount() {
    urlApi.addMissingQueryParameters(this.props.location.query);
    datasetApi.getDatasets();
  }

  componentWillReceiveProps(nextProps) {
    const previousDatasetId = this.datasetId;

    if (nextProps.location.query.ds) {
      this.datasetId = urlApi.getDatasetId(nextProps.location);

      if (!this.fetchedMetadata || this.datasetId !== previousDatasetId) {
        metricApi.getMetricMetadata(this.datasetId);
        this.fetchedMetadata = true;
      }
    }
  }

  _isALL(qpKey) {
    return qpKey && qpKey === 'ALL';
  }

  // Return a sorted array of population names, where the term "sorted" means
  // the following:
  //
  // The "control" population is the first element of the array and all other
  // populations appear in alphabetical order.
  //
  // For example:
  // ['z', 'b', 'control', 'a'] => ['control', 'a', 'b', 'z']
  //
  // We want populations to appear in this order wherever they are displayed.
  _sortPopulations(populations) {
    var control = populations.find(e => e === 'control');

    if (control) {
      var noControl = populations.filter(e => e !== 'control');
      return [control].concat(noControl.sort());
    } else {
      return populations.sort();
    }
  }

  _processProps(props) {
    this.datasetId = urlApi.getDatasetId(props.location);

    const showAllMetrics = this._isALL(props.location.query.metrics);
    const showAllPopulations = this._isALL(props.location.query.pop);

    this.metricIdsToShow = [];
    if (showAllMetrics && this.currentDataset.metrics) {
      this.metricIdsToShow = this.currentDataset.metrics;
    } else {
      this.metricIdsToShow = urlApi.getMetricIds(props.location);
    }

    // Assign a numeric ID to each population. For example:
    //
    // {
    //     'control': 1,
    //     'group A': 2,
    // }
    //
    // By assigning the IDs here, they will be consistent throughout the
    // application and we can, for example, assign consistent CSS colors for
    // populations.
    this.populationIds = {};
    if (this.currentDataset.populations) {
      this.allPopulationsSorted = this._sortPopulations(this.currentDataset.populations);
      this.allPopulationsSorted.map((pop, index) => {
        this.populationIds[pop] = index + 1;
      });
    }

    if (showAllPopulations) {
      if (this.currentDataset.populations) {
        this.sortedPopulationsToShow = this.allPopulationsSorted;
      }
    } else {
      this.sortedPopulationsToShow = this._sortPopulations(urlApi.getPopulationNames(props.location));
    }


    // Validate input
    switch (props.location.query.scale) {
      case 'linear':
      case 'log':
        this.scale = props.location.query.scale;
    }

    // Validate input and convert to boolean
    //
    // If the URL contains...  |  this.showOutliers is...
    // --------------------------------------------------
    // showOutliers=true       |  true
    // showOutliers=false      |  false
    // Anything else           |  false
    if (props.location.query && props.location.query.showOutliers) {
      this.showOutliers = props.location.query.showOutliers === 'true';
    }
  }

  componentWillUpdate(nextProps) {
    if (this.datasetId && nextProps.datasets.length > 0) {
      this.currentDataset = nextProps.datasets.find(ds => ds.id === this.datasetId) || {};
      store.dispatch(datasetActions.changeDataset(this.currentDataset));
    }
    this._processProps(nextProps);
  }

  render() {
    // If we don't know anything about the dataset or don't have any metric
    // metdata, we can't do much right now. We could in theory temporarily show
    // the "No data" message until the data comes through, but that would look
    // weird.
    if (this.props.datasets.length === 0 || Object.keys(this.props.metricMetadata).length === 0) {
      return null;
    }

    // Pass some props to the child component
    return React.cloneElement(this.props.children, {
      datasetId: this.datasetId,
      currentDataset: this.currentDataset,

      scale: this.scale,
      showOutliers: this.showOutliers,
      metricMetadata: this.props.metricMetadata,

      sortedPopulationsToShow: this.sortedPopulationsToShow,
      populationIds: this.populationIds,

      metricIdsToShow: this.metricIdsToShow,
    });
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    datasets: store.datasetState.datasets,
    metricMetadata: store.metricMetadataState.metadata,
  };
};

export default connect(mapStateToProps)(AppContainer);
