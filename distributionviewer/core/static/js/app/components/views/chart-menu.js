import React from 'react';


export class ChartMenu extends React.Component {
  render() {
    return (
      <nav className="chart-menu">
        <ul>
          {this.props.items.map(metric => {
            return (
              <li key={`menu-${metric.id}`}>
                <a href={`/chart/${metric.id}/`}>{metric.name}</a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
