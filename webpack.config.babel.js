import path from 'path';
import webpack from 'webpack';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'TRACKING_ID': JSON.stringify(process.env.TRACKING_ID),
    }
  })
];

// Debugging is a bit tricker when the bundle is compressed, so only compress it
// on production.
if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      warnings: false
    }
  }));
}

module.exports = {
  entry: './distributionviewer/core/static/js/app/app.js',
  output: {
    filename: './distributionviewer/core/static/js/bundle.js',
    sourceMapFilename: './distributionviewer/core/static/js/bundle.map'
  },
  devtool: '#source-map',
  plugins,
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};
