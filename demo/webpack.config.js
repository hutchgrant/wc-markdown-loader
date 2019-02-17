const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',

  devServer: {
    port: 1981,
    host: 'localhost',
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  context: path.resolve('./src'),

  entry: {
    index: './index'
  },

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].[chunkhash].bundle.js',
    publicPath: '/'
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.md$/,
        loaders: [
          'babel-loader',
          path.resolve('../src/index.js')
        ]
      },
      {
        test: /\.css$/,
        use: ['css-to-string-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      chunksSortMode: 'dependency'
    })
  ]
};
