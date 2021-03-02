const cors = require('cors');
const express = require('express');
const webpack = require('webpack');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');

const config = require('../config/config');

module.exports.init = async () => {
  // Set up Mongoose
  const mongoDB = config.db.uri;
  const mongoOptions = config.db.options;
  try {
    await mongoose.connect(mongoDB, mongoOptions);
    console.log('Successfully connected to mongoose database.');
  } catch (err) {
    console.log('MongoDB Connection Error:', error);
  }

  let api = config.proxy.api;

  const app = express();
  app.options('*', cors());
  app.use(createProxyMiddleware(api.routes, api.options));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors({ origin: '*' }));
  app.use(cookieParser());

  // API Routing
  app.use('/api/', require('./routes'));

  app.all('/api/', (req, res) => {
    // TODO: Make better, possibly guess the correct route?
    res.status(404).send('Unknown API call.');
  });

  // Serve static files
  if (config.isDev) {
    app.use(historyApiFallback({ verbose: false }));
    const compiler = webpack(config.webpack.config);
    app.use(webpackDevMiddleware(compiler, config.webpack.middleware.options));
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(config.webpack.dist));
  } else {
    app.use(express.static(config.webpack.dist));
    app.get('*', function(req, res) {
      res.sendFile(config.webpack.index);
      res.end();
    });
  }

  return app;
};
