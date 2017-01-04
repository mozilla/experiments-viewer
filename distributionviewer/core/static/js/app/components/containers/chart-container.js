import React from 'react';
import { connect } from 'react-redux';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import Chart from '../views/chart';
import * as metricApi from '../../api/metric-api';
import { debounce } from '../../utils';


class ChartContainer extends React.Component {
  constructor(props) {
    super(props);

    this.margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.height = props.isDetail ? 600 : 250;

    this.state = {size: {
      height: this.height,
      innerHeight: this.height - this.margin.top - this.margin.bottom,
      transform: `translate(${this.margin.left}, ${this.margin.top})`,
    }};

    this.handleResize = debounce(() => this._setWidth(this.props));
    this.hasBeenInitialized = false;

    this._setWidth = this._setWidth.bind(this);
  }

  componentDidMount() {
    metricApi.getMetric(this.props.metricId);

    if (this.props.isDetail) {
      this.chartDetail = document.getElementById('chart-detail');
    }
  }

  componentWillReceiveProps(nextProps) {
    // If the metric data just came through, initialize the chart before the
    // next render occuurs.
    if (!this.hasBeenInitialized && nextProps.metric) {
      this._initialize(nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    const showOutliers = this.props.showOutliers;
    const outliersSettingChanged = showOutliers !== prevProps.showOutliers;
    const selectedScaleChanged = this.props.selectedScale !== prevProps.selectedScale;

    // If the outliers setting changed, update the active data accordingly.
    // Check against false explicitly because props are sometimes undefined.
    if (outliersSettingChanged) {
      if (showOutliers) {
        this.activeData = this.allData;
      } else if (showOutliers === false) {
        this.activeData = this.dataExcludingOutliers;
      }
    }

    // If either the outliers setting or the selected scale has changed, the
    // x-axis will need to show different ticks and thus needs to be
    // regenerated.
    if (outliersSettingChanged || selectedScaleChanged) {
      this.setState({xScale: this._getXScale(this.props, this.state.size.innerWidth)});
    }
  }

  _initialize(props) {
    const outlierThreshold = 100;

    this.allData = this._getFormattedData(props.metric.populations[0].points);

    if (props.metric.type === 'numeric' && this.allData.length > outlierThreshold) {
      this.dataExcludingOutliers = this._removeOutliers(this.allData);
      this.activeData = props.showOutliers ? this.allData : this.dataExcludingOutliers;
    } else {
      this.activeData = this.allData;
    }

    this.refLabels = [];
    this.activeData.map(item => {
      this.refLabels[item.x] = item.label;
    });

    this.yScale = d3Scale.scaleLinear()
                    .domain([0, d3Array.max(this.activeData, d => d.y)])
                    .range([this.state.size.innerHeight, 0])
                    .nice(); // Y axis should extend to nicely readable 0..100

    this._setWidth(props);
    if (props.isDetail) {
      window.addEventListener('resize', this.handleResize);
    }

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

  // Return an array with only the central 99% of elements included. Assumes
  // allData is sorted.
  _removeOutliers(allData) {
    // The indices of the first and last element to be included in the result
    const indexFirst = Math.round(allData.length * 0.005) - 1;
    const indexLast = Math.round(allData.length * 0.995) - 1;

    // Add 1 to indexLast because the second paramater to Array.slice is not
    // inclusive
    return allData.slice(indexFirst, indexLast + 1);
  }

  _getXScale(props, innerWidth) {
    // Category charts get treated differently since they start at x: 1
    let xScale;
    if (props.metric.type === 'category') {
      xScale = d3Scale.scaleLinear()
                 .domain([1, d3Array.max(this.activeData, d => d.x)])
                 .range([0, innerWidth]);
    } else {
      let scaleType;

      switch(props.selectedScale) {
        case 'linear':
          scaleType = d3Scale.scaleLinear();
          break;
        case 'log':
          scaleType = d3Scale.scaleLog();
          break;
        default:
          scaleType = d3Scale.scaleLinear();
          break;
      }

      xScale = scaleType
                 .domain(d3Array.extent(this.activeData, d => d.x))
                 .range([0, innerWidth]);
    }

    return xScale;
  }

  _setWidth(props) {
    // width = size of the SVG
    let width;
    if (props.isDetail) {
      width = parseInt(getComputedStyle(this.chartDetail)['width'], 10);
    } else {
      width = 300;
    }

    // innerWidth = size of the contents of the SVG
    const innerWidth = width - this.margin.left - this.margin.right;
    const xScale = this._getXScale(props, innerWidth);
    const sizeIncludingWidth = Object.assign({}, this.state.size, {width, innerWidth});
    this.setState({xScale, size: sizeIncludingWidth});
  }

  render() {
    if (!this.hasBeenInitialized) {
      return <Chart isFetching={true} {...this.props} />;
    } else {
      return (
        <Chart
          isFetching={false}

          metricId={this.props.metricId}
          name={this.props.metric.metric}
          data={this.activeData}
          refLabels={this.refLabels}
          metricType={this.props.metric.type}
          showOutliers={this.props.showOutliers}
          hoverString={this.props.metric.hoverString}
          tooltip={this.props.tooltip}

          size={this.state.size}
          xScale={this.state.xScale}
          yScale={this.yScale}
        />
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    metric: store.metricState.metrics[ownProps.metricId],
  };
};

export default connect(mapStateToProps)(ChartContainer);
