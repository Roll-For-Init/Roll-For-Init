// eslint-disable-next-line no-unused-vars
const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { root } = require("./helpers");
const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  devtool: "eval-source-map",

  mode: "development",

  entry: {
    app: ["webpack-hot-middleware/client?reload=true"]
  },

  output: {
    filename: "js/[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },

  devServer: {
    contentBase: root("client/public/"),
    historyApiFallback: true,
    // none (or false), errors-only, minimal, normal (or true) and verbose
    stats: {
      preset: 'minimal',
      context: root('client'),
      children: true
    },
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: root("client/public/index.html")
    })
  ],

  module: {
    rules: [
      // CSS files
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { 
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // SCSS files
      {
        test: /\.scss$/i,
        include: root("client"),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          { 
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          },
        ]
      }
    ]
  }
});
