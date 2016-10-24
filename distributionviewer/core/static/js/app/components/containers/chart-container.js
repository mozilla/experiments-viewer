import React from 'react';
import { connect } from 'react-redux';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import Chart from '../views/chart';
import * as metricApi from '../../api/metric-api';


class ChartContainer extends React.Component {
  constructor(props) {
    super(props);

    let margin = {top: 20, right: 20, bottom: 30, left: 40};

    let width = props.isDetail ? 1000 : 300;
    let height = props.isDetail ? 600 : 250;

    // width = size of the SVG
    // innerWidth = size of the contents of the SVG
    this.size = {
      width,
      height,
      innerWidth: width - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
      transform: `translate(${margin.left}, ${margin.top})`
    };

    this.hasBeenInitialized = false;
  }

  componentWillMount() {
    // If the metric prop already exists, the metric data must have already been
    // downloaded elsewhere in the app. Initilize the chart now before the
    // initial render.
    if (this.props.metric) {
      this._initialize(this.props);
    }
  }

  componentDidMount() {
    metricApi.getMetric(this.props.metricId);
  }

  componentWillReceiveProps(nextProps) {
    // If the metric prop just came through, the metric data must have just been
    // downloaded. Initialize the chart before another render happens.
    if (!this.hasBeenInitialized && nextProps.metric) {
      this._initialize(nextProps);
    }
  }

  _initialize(props) {
    this.data = this._getFormattedData(props.metric.points);

    this.refLabels = [];
    this.data.map(item => {
      this.refLabels[item.x] = item.label;
    });

    // Category charts get treated differently since they start at x: 1
    if (props.metric.type === 'category') {
      this.xScale = d3Scale.scaleLinear()
                      .domain([1, d3Array.max(this.data, d => d.x)])
                      .range([0, this.size.innerWidth]);
    } else {
      this.xScale = d3Scale.scaleLinear()
                      .domain([0, d3Array.max(this.data, d => d.x)])
                      .range([0, this.size.innerWidth]);
    }

    this.yScale = d3Scale.scaleLinear()
                    .domain([0, d3Array.max(this.data, d => d.y)])
                    .range([this.size.innerHeight, 0])
                    .nice(); // Y axis should extend to nicely readable 0..100

    this.hasBeenInitialized = true;
  }

  // Map metric points to new keys to be used by d3.
  _getFormattedData(dataPoints) {
    var formattedPoints = [];

    for (let i = 0; i < dataPoints.length; i++) {
      formattedPoints.push({
        x: dataPoints[i]['refRank'] || parseFloat(dataPoints[i]['b']),
        y: dataPoints[i]['c'],
        p: dataPoints[i]['p'],
        label: dataPoints[i]['b']
      });
    }

    return formattedPoints;
  }

  render() {
    if (!this.props.metric) {
      return <Chart isFetching={true} {...this.props} />;
    } else {
      return (
        <Chart
          isFetching={false}

          metricId={this.props.metricId}
          name={this.props.metric.metric}
          data={this.data}
          refLabels={this.refLabels}
          metricType={this.props.metric.type}
          showOutliers={this.props.showOutliers}
          hoverString={this.props.metric.hoverString}

          size={this.size}
          xScale={this.xScale}
          yScale={this.yScale}
        />
      );
    }
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    metric: store.metricState.metrics[ownProps.metricId],
  };
};

export default connect(mapStateToProps)(ChartContainer);
