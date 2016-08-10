import React from 'react';

export class FilteredCharts extends React.Component {
  constructor(props) {
    super(props);
    this.filteredClass = 'filtered';
  }

  componentDidMount() {
    document.body.classList.add(this.filteredClass);
  }

  componentWillUnmount() {
    document.body.classList.remove(this.filteredClass);
  }

  render() {
    return (
      <div className="filtered-charts">
        <nav className="filters">
          <ul>
            <li><a href="#">OS by Version</a></li>
            <li><a href="#">Update Channel</a></li>
            <li><a href="#">Firefox Version</a></li>
            <li><a href="#">CPU Count</a></li>
            <li><a href="#">System Memory</a></li>
          </ul>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

FilteredCharts.propTypes = {
  children: React.PropTypes.node.isRequired,
}
