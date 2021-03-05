const { root } = require('./helpers');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  stats: {
    preset: 'minimal',
    context: root('client'),
    children: true
  },
  
  entry: {
    app: [root("client/app/index.jsx")]
  },

  output: {
    path: root("dist"),
    publicPath: '/',
    assetModuleFilename: 'assets/imgs/[hash][ext][query]'
  },

  resolve: {
    extensions: [".js", ".json", ".css", ".scss", ".html", ".jsx"],
    alias: {
      app: "client/app"
    },
  },

  plugins: [
    new CleanWebpackPlugin(),
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
        test: /\.html$/,
        include: root("client"),
        loader: 'html-loader',
        generator: {
          filename: '[hash][ext][query]'
        }
      },
      {
        test: /\.(svg)$/i,
        include: root("client"),
        type: 'asset/resource',
        generator: {
          filename: '[name].[ext]'
        }
      },
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
      //process node_module source maps
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  },
};
