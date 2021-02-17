const nodemon = require('nodemon');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, './secret.env'),
  debug: process.env.DEBUG
});

const watchList = ['server/'];
const isDev = (process.env.NODE_ENV === 'development');

const legacyWatch = (process.env.LEGACY_WATCH) ? (isDev ? true : false) : false;
const watch = isDev ? watchList : false;

nodemon({
  script: path.join(__dirname, 'server/server'),
  ext: 'js, json',
  execMap: {
    js: 'node'
  },
  ignore: [],
  verbose: true,
  // Use legacy watch for file updates with env file modifier
  legacyWatch: legacyWatch,
  watch: watch,
})

nodemon.on('start', function () {
  console.log('[Nodemon] Server started!');
}).on('crash', function (err) {
  console.log('[Nodemon] Server crashed: ', err);
}).on('restart', function (files) {
  console.log('[Nodemon] Server restarted due to: ', files);
}).once('quit', function () {
  console.log('[Nodemon] Shutting down server');
  process.exit()
});
