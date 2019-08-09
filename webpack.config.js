const {join, resolve} = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ringUiWebpackConfig = require('@jetbrains/ring-ui/webpack.config');
const variables = require('@jetbrains/ring-ui/extract-css-vars');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pkgConfig = require('./package.json').config;

const componentsPath = join(__dirname, pkgConfig.components);

// Patch @jetbrains/ring-ui svg-sprite-loader config
ringUiWebpackConfig.loaders.svgSpriteLoader.include.push(
  require('@jetbrains/logos'),
  require('@jetbrains/icons')
);

ringUiWebpackConfig.loaders.cssLoader.use[0] = MiniCssExtractPlugin.loader;

const webpackConfig = () => ({
  mode: 'development',
  entry: `${componentsPath}/app/app.js`,
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    alias: {
      react: resolve('./node_modules/react'),
      'react-dom': resolve('./node_modules/react-dom'),
      '@jetbrains/ring-ui': resolve('./node_modules/@jetbrains/ring-ui')
    }
  },
  output: {
    path: resolve(__dirname, pkgConfig.dist),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
  },
  module: {
    rules: [
      ...ringUiWebpackConfig.config.module.rules,
      {
        test: /\.css$/,
        include: [resolve(__dirname, join('node_modules', '@jetbrains', 'hub-widget-ui'))],
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.css$/,
        include: [componentsPath],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:7]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                ctx: {variables}
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: [
          join(__dirname, 'node_modules/chai-as-promised'),
          componentsPath
        ],
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.po$/,
        include: [
          componentsPath
        ],
        use: [
          'json-loader',
          {
            loader: 'angular-gettext-loader',
            options: {
              format: 'json'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true,
    stats: {
      assets: false,
      children: false,
      chunks: false,
      hash: false,
      version: false
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html-loader?interpolate!src/index.html'
    }),
    new CopyWebpackPlugin([
      'manifest.json'
    ], {}),
    new MiniCssExtractPlugin({filename: '[name].[hash:4].css'})
  ]
});

module.exports = webpackConfig;
