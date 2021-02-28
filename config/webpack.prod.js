// eslint-disable-next-line no-unused-vars
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const commonConfig = require("./webpack.common");
const { root } = require('./helpers');

module.exports = merge(commonConfig, {
  mode: "production",

  output: {
    filename: "js/[name].[contenthash].bundle.js",
    chunkFilename: "[id].[contenthash].chunk.js"
  },

  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
      }),
      new TerserPlugin(),
      new HtmlWebpackPlugin({
        template: root("client/public/index.html"),
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
        }
      }),
    ],
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    })
  ],

  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        include: root("client"),
        generator: {
          filename: 'assets/fonts/[hash][ext][query]'
        }
      },
      // Static files
      {
        test: /\.(png|jpe?g|gif)$/i,
        include: root("client"),
        type: 'asset/resource',
      },
      // JS files
      {
        test: /\.(js|jsx)$/,
        include: root("client"),
        loader: "babel-loader",
      },
      // CSS files
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, "css-loader" ]
      },
      // SCSS files
      {
        test: /\.scss$/i,
        include: root("client"),
        use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader" ],
      }
    ]
  }
});
