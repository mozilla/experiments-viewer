import React from 'react';

export class FilteredCharts extends React.Component {
  constructor(props) {
    super(props);
    this.filteredClass = 'filtered';
  }

  componentDidMount() {
    this.wrapper = document.getElementsByClassName('global-wrapper')[0];
    this.wrapper.classList.add(this.filteredClass);
  }

  componentWillUnmount() {
    this.wrapper.classList.remove(this.filteredClass);
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
