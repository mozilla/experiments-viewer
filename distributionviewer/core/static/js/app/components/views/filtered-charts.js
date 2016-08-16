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
        {this.props.children}
      </div>
    );
  }
}

FilteredCharts.propTypes = {
  children: React.PropTypes.node.isRequired,
}
