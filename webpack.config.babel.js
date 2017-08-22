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
  entry: './viewer/static/js/app/app.js',
  output: {
    filename: './viewer/static/js/bundle.js',
    sourceMapFilename: './viewer/static/js/bundle.map'
  },
  devtool: '#source-map',
  plugins,
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
