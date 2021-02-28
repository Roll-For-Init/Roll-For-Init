const nodemon = require('nodemon');

const config = require('./config/config');

if(config.isDev){
  nodemon(config.nodemon)
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
} else {
  require('./server/server');
}