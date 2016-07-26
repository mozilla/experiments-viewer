import React from 'react';
import { Link } from 'react-router';

import MG from 'metrics-graphics';

export class ExampleChart extends React.Component {
  componentDidMount() {
    var exampleData = [
      { x: 0,   y: 10 },
      { x: 5,   y: 10 },
      { x: 10,  y: 10 },
      { x: 15,  y: 10 },
      { x: 20,  y: 10 },
      { x: 25,  y: 12 },
      { x: 30,  y: 14 },
      { x: 35,  y: 18 },
      { x: 40,  y: 24 },
      { x: 45,  y: 32 },
      { x: 50,  y: 42 },
      { x: 55,  y: 54 },
      { x: 60,  y: 64 },
      { x: 65,  y: 72 },
      { x: 70,  y: 78 },
      { x: 75,  y: 82 },
      { x: 80,  y: 84 },
      { x: 85,  y: 85 },
      { x: 90,  y: 86 },
      { x: 95,  y: 86 },
      { x: 100, y: 86 },
    ];

    /* eslint-disable camelcase */
    MG.data_graphic({
      target: this.target,

      // Data
      data: exampleData,
      x_accessor: 'x',
      y_accessor: 'y',

      // General display
      title: 'Number of available TV channels',
      width: this.props.width,
      height: this.props.height,
      area: false,

      // x-axis
      x_label: 'channels',
      x_mouseover: data => 'x: ' + data.x + '%',

      // y-axis
      max_y: 100,
      y_mouseover: data => '   y: ' + data.y + '%',
    });
    /* eslint-enable camelcase */
  }

  render() {
    var chart = <div ref={ref => this.target = ref}></div>;

    if (this.props.link) {
      return <Link to="/chart/1/">{chart}</Link>;
    } else {
      return chart;
    }
  }
}

ExampleChart.propTypes = {
  height: React.PropTypes.number.isRequired,
  link: React.PropTypes.bool.isRequired,
  width: React.PropTypes.number.isRequired,
}
