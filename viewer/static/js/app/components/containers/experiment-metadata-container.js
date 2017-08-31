import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import ExperimentMetadata from '../views/experiment-metadata';

class ExperimentMetadataContainer extends React.Component {
  render() {
    return <ExperimentMetadata {...this.props } />;
  }
}

const mapStateToProps = function(store) {
  const currentDataset = store.datasetState.currentDataset;

  let numClients = 0;
  let numPings = 0;
  for (let populationName in currentDataset.populations) {
    if (currentDataset.populations.hasOwnProperty(populationName)) {
      const thisPopulation = currentDataset.populations[populationName];

      if (thisPopulation.total_clients) {
        numClients += thisPopulation.total_clients;
      }

      if (thisPopulation.total_pings) {
        numPings += thisPopulation.total_pings;
      }
    }
  }

  return {
    name: currentDataset.name,
    slug: currentDataset.slug,
    date: dateFormat(new Date(currentDataset.date), 'longDate', true),
    numClients,
    numPings,
  };
};

export default connect(mapStateToProps)(ExperimentMetadataContainer);
