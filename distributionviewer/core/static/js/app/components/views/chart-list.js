import React from 'react';

import ChartContainer from '../containers/chart-container';

export class ChartList extends React.Component {
  render() {
    return (
      <section className="chart-list">
        {this.props.items.map(chart => {
          return (
            <ChartContainer key={chart.name} width={350} height={250} link={true} chartName={chart.name} />
          );
        })}
      </section>
    );
  }
}

ChartList.propTypes = {
  items: React.PropTypes.array.isRequired,
}
