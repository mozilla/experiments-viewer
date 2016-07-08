var path = require('path');

module.exports = {
  entry: './distributionviewer/core/static/js/app/app.js',
  output: {
    filename: './distributionviewer/core/static/js/bundle.js',
    sourceMapFilename: './distributionviewer/core/static/js/bundle.map'
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};
