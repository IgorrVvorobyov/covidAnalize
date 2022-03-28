 const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  watch: true,
  output: {
     path: path.join(__dirname, 'dist'),

    filename: "bundle.js",

  },
  module: {
    rules: [{
      test: /\.js$/,

      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],


    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  devtool: 'source-map'

};