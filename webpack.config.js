const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { resolve } = require('path');
const Dotenv = require('dotenv-webpack');

const { NODE_ENV } = process.env;

module.exports = {
  entry: resolve(__dirname, 'src/js/index.js'),
  output: {
    filename: 'bundle.js',
    path: resolve(`${__dirname}/dist`),
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  devtool: NODE_ENV === 'production' ? 'hidden-source-map' : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpg)$/i,
        type: 'asset/resource',
        generator: {
          filename: './image/[contenthash][ext]',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'index.html'),
    }),
    new MiniCssExtractPlugin(),
    new Dotenv(),
  ],
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  devServer: {
    compress: true,
    port: 9000,
    client: {
      logging: 'info',
    },
  },
};
