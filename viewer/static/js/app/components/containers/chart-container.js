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

    this.margin = {top: 15, right: 20, bottom: 30, left: 40};
    this.height = props.isDetail ? 600 : 375;
    this.width = 450;
    this.allDatasetName = 'all';
    this.excludingOutliersDatasetName = 'excludingOutliers';

    this.size = {
      height: this.height,
      width: this.width,
      innerWidth: this.width - this.margin.left - this.margin.right,
      innerHeight: this.height - this.margin.top - this.margin.bottom - 30,
      transform: `translate(${this.margin.left}, ${this.margin.top})`,
    };

    this.outlierThreshold = 100;
    this._getXScale = this._getXScale.bind(this);
  }

  componentDidMount() {
    metricApi.getMetric(this.props.datasetId, this.props.metricId, this.props.populationsToShow);

    if (this.props.isDetail) {
      this.chartDetail = document.getElementById('chart-detail');
    }
  }

  componentWillReceiveProps(nextProps) {
    // If the metric data changed or just came through for the first time, set
    // the chart up before the next render occurs.
    if (this.props.metric !== nextProps.metric) {
      if (nextProps.metric.populations.length === 0) {
        this.noData = true;
      } else {
        this.noData = false;
        this._setup(nextProps);
      }
    }
  }

  componentWillUpdate(nextProps) {
    // If the outliers setting changed, update the active dataset accordingly.
    // Check against false explicitly because props are sometimes undefined.
    if (nextProps.showOutliers !== this.props.showOutliers) {
      if (nextProps.showOutliers) {
        this.activeDatasetName = this.allDatasetName;
      } else if (nextProps.showOutliers === false) {
        this.activeDatasetName = this.excludingOutliersDatasetName;
      }
    }

    // If the list of populations to show changed, fetch chart data with the
    // next populations

    if (nextProps.populationsToShow !== this.props.populationsToShow) {
      metricApi.getMetric(this.props.datasetId, this.props.metricId, nextProps.populationsToShow);
    }
  }

  componentDidUpdate(prevProps) {
    const outliersSettingChanged = this.props.showOutliers !== prevProps.showOutliers;
    const selectedScaleChanged = this.props.scale !== prevProps.scale;

    // If either the outliers setting or the selected scale has changed, the
    // x-axis will need to show different ticks and thus needs to be
    // regenerated.
    if (outliersSettingChanged || selectedScaleChanged) {
      this.biggestDatasetToShow = this.populationData[this.biggestPopulation.name][this.activeDatasetName];
    }
    this.xScale = this._getXScale(this.props);
  }

  _setup(props) {
    this.biggestPopulation = props.metric.populations[0]; // To start... we'll bubble up the actual biggest population later

    this.populationData = {};
    for (let i = 0; i < props.metric.populations.length; i++) {
      const population = props.metric.populations[i];
      const fmtData = this._getFormattedData(population.points);

      // Check against false explicitly because props are sometimes undefined
      let fmtDataExcludingOutliers;
      if (props.showOutliers === false) {
        fmtDataExcludingOutliers = this._removeOutliers(fmtData);
      }

      // If this population has the most data points so far, it's the biggest
      // population. We'll need to know which population is biggest when we set
      // the scales later.
      if (population.points.length > this.biggestPopulation.points.length) {
        this.biggestPopulation = population;
      }

      this.populationData[population.name] = {};
      this.populationData[population.name][this.allDatasetName] = fmtData;
      if (fmtDataExcludingOutliers) {
        this.populationData[population.name][this.excludingOutliersDatasetName] = fmtDataExcludingOutliers;
      }
    }

    if (props.showOutliers === false && this.biggestPopulation.points.length > this.outlierThreshold) {
      this.activeDatasetName = this.excludingOutliersDatasetName;
    } else {
      this.activeDatasetName = this.allDatasetName;
    }

    // Make a copy of the biggest dataset we can show right now. That is, the
    // dataset from the biggest population after it is optionally trimmed of
    // outliers.
    //
    // We'll need this when setting the scales.
    this.biggestDatasetToShow = this.populationData[this.biggestPopulation.name][this.activeDatasetName];

    this.refLabels = [];
    this.biggestDatasetToShow.map(item => {
      this.refLabels[item.x] = item.label;
    });

    this.yScale = d3Scale.scaleLinear()
                    .domain([0, 1]) // 0% to 100%
                    .range([this.size.innerHeight, 0]);
    this.xScale = this._getXScale(props);
  }

  // Map metric points to new keys to be used by d3.
  _getFormattedData(dataPoints) {
    var formattedPoints = [];

    for (let i = 0; i < dataPoints.length; i++) {
      formattedPoints.push({
        x: dataPoints[i]['refRank'] || parseFloat(dataPoints[i]['b']),
        y: dataPoints[i]['p'],
        p: dataPoints[i]['p'],
        label: dataPoints[i]['b']
      });
    }

    return formattedPoints;
  }

  // Return an array with only the central 99% of elements included. Assumes
  // data is sorted.
  _removeOutliers(data) {
    if (data.length <= this.outliersThreshold) return data;

    // The indices of the first and last element to be included in the result
    const indexFirst = Math.round(data.length * 0.005) - 1;
    const indexLast = Math.round(data.length * 0.995) - 1;

    // Add 1 to indexLast because the second paramater to Array.slice is not
    // inclusive
    return data.slice(indexFirst, indexLast + 1);
  }

  _getXScale(props) {
    // Categorical charts get treated differently since they start at x: 1
    let xScale;

    if (props.metric.type === 'C') {
      xScale = d3Scale.scaleLinear()
                 .domain([1, d3Array.max(this.biggestDatasetToShow, d => d.x)])
                 .range([0, this.size.innerWidth]);
    } else {
      let scaleType;

      switch(props.scale) {
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
                 .domain(d3Array.extent(this.biggestDatasetToShow, d => d.x))
                 .range([0, this.size.innerWidth]);
    }

    return xScale;
  }

  render() {
    // Data was loaded from the API, but there was no data to show for this
    // chart
    if (this.noData) {
      return <Chart noData={true} {...this.props} />;

    // Data has not yet been loaded from the API
    } else if (!this.populationData) {
      return <Chart {...this.props} isFetching={true} />;

    // Data has been loaded from the API and there is data to show for this
    // chart
    } else {
      return (
        <Chart
          {...this.props}

          isFetching={false}

          name={this.props.metric.name}
          populationData={this.populationData}
          refLabels={this.refLabels}
          metricType={this.props.metric.type}
          activeDatasetName={this.activeDatasetName}
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
