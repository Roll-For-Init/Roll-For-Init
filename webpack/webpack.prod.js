// eslint-disable-next-line no-unused-vars
const webpack = require("webpack");
const merge = require("webpack-merge");

const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  mode: "production",

  output: {
    filename: "js/[name].[hash].js",
    chunkFilename: "[id].[hash].chunk.js"
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
});