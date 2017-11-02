import React from 'react';
import { connect } from 'react-redux';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import Chart from '../views/chart';
import * as metricApi from '../../api/metric-api';


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

    this.outliersThreshold = 10;
    this.outliersSmallestProportion = 0.0001;
    this._getXScale = this._getXScale.bind(this);
  }

  componentDidMount() {
    metricApi.getMetric(
      this.props.dataset,
      this.props.metricId,
      this.props.sortedPopulationsToShow,
      this.props.subgroup
    );

    if (this.props.isDetail) {
      this.chartDetail = document.getElementById('chart-detail');
    }
  }

  componentWillReceiveProps(nextProps) {
    // If the metric data changed or just came through for the first time, set
    // the chart up before the next render occurs.
    if (nextProps.metric && this.props.metric !== nextProps.metric) {
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
    if (nextProps.sortedPopulationsToShow !== this.props.sortedPopulationsToShow) {
      metricApi.getMetric(
        this.props.dataset,
        this.props.metricId,
        nextProps.sortedPopulationsToShow,
        nextProps.subgroup
      );
    }
  }

  componentDidUpdate(prevProps) {
    const outliersSettingChanged = this.props.showOutliers !== prevProps.showOutliers;
    const selectedScaleChanged = this.props.scale !== prevProps.scale;

    // If either the outliers setting or the selected scale has changed, the
    // x-axis will need to show different ticks and thus needs to be
    // regenerated.
    if (outliersSettingChanged || selectedScaleChanged) {
      this.biggestDatasetToShow = this.populationData[this.biggestPopulation.name]['data'][this.activeDatasetName];
    }

    if (this.props.metric && this.biggestDatasetToShow) {
      this.xScale = this._getXScale(this.props);
    }
  }

  _setup(props) {
    this.biggestPopulation = props.metric.populations[0]; // To start... we'll bubble up the actual biggest population later

    this.populationData = {};
    this.allPopulationsDataPoints = [];

    for (let i = 0; i < props.metric.populations.length; i++) {
      const population = props.metric.populations[i];
      const fmtData = this._getFormattedData(population.points);

      // Store all points in a flat array to be used with d3Array.extent() for the y-axis d3Axis.domain()
      this.allPopulationsDataPoints = this.allPopulationsDataPoints.concat(this.allPopulationsDataPoints, fmtData);

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

      this.populationData[population.name] = {
        numObs: population.numObs,
        data: {},
      };
      this.populationData[population.name]['data'][this.allDatasetName] = fmtData;
      if (fmtDataExcludingOutliers) {
        this.populationData[population.name]['data'][this.excludingOutliersDatasetName] = fmtDataExcludingOutliers;
      }
    }

    if (props.showOutliers === false && this.biggestPopulation.points.length > this.outliersThreshold) {
      this.activeDatasetName = this.excludingOutliersDatasetName;
    } else {
      this.activeDatasetName = this.allDatasetName;
    }

    // Make a copy of the biggest dataset we can show right now. That is, the
    // dataset from the biggest population after it is optionally trimmed of
    // outliers.
    //
    // We'll need this when setting the scales.
    this.biggestDatasetToShow = this.populationData[this.biggestPopulation.name]['data'][this.activeDatasetName];

    this.refLabels = [];

    this.biggestDatasetToShow.map(item => {
      this.refLabels.push(item.label);
    });

    this.yScale = d3Scale.scaleLinear()
                    .domain(d3Array.extent(this.allPopulationsDataPoints, d => d.y))
                    .range([this.size.innerHeight, 0])
                    .nice();

    this.xScale = this._getXScale(props);
  }

  // Map metric points to new keys to be used by d3.
  _getFormattedData(dataPoints) {
    var formattedPoints = [];

    for (let i = 0; i < dataPoints.length; i++) {
      formattedPoints.push({
        index: parseInt(dataPoints[i]['refRank'], 10),
        x: parseFloat(dataPoints[i]['b']),
        y: dataPoints[i]['p'],
        p: dataPoints[i]['p'],
        label: dataPoints[i]['b']
      });
    }

    return formattedPoints;
  }

  // Return an array with buckets with data less than the
  // `outliersSmallestProportion` trimmed from left and right.
  _removeOutliers(data) {
    if (data.length <= this.outliersThreshold) return data;

    let indexLast = data.length - 1;
    for (; indexLast >= 0; indexLast--) {
      if (data[indexLast]['p'] > this.outliersSmallestProportion) {
        break;
      }
    }

    // Add 1 because the second paramater to Array.slice is not inclusive.
    return data.slice(0, indexLast + 1);
  }

  _getXScale(props) {
    return d3Scale.scaleLinear()
            .domain([0, this.biggestDatasetToShow.length - 1])
            .range([0, this.size.innerWidth]);
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
          endpoint={this.props.endpoint}
          populationData={this.populationData}
          refLabels={this.refLabels}
          metricType={this.props.metric.type}
          activeDatasetName={this.activeDatasetName}
          hoverString={this.props.metric.hoverString}
          xunit={this.props.xunit}

          size={this.size}
          xScale={this.xScale}
          yScale={this.yScale}
        />
      );
    }
  }
}

const mapStateToProps = function(store, ownProps) {
  const props = {
    subgroup: store.datasetState.subgroup,
  };

  const metric = store.metricState.metrics[ownProps.metricId];

  if (metric) {
    props['metric'] = metric.content;
    props['endpoint'] = metric.endpoint;
  }

  return props;
};

export default connect(mapStateToProps)(ChartContainer);
