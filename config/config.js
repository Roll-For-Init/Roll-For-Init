const dotenv = require('dotenv');
const {root} = require('./helpers');

dotenv.config({
  path: './secret.env',
  debug: process.env.DEBUG
});

const isDev = (process.env.NODE_ENV !== "production");

const nodemonWatchList = isDev ? [root('server/')] : false;

const webpackConfig = require('../webpack.config');

const apiRoutes = [
  '/api/ability-scores/**',
  '/api/classes/**',
  '/api/conditions/**',
  '/api/damage-types/**',
  '/api/equipment-categories/**',
  '/api/equipment/**',
  '/api/features/**',
  '/api/languages/**',
  '/api/magic-schools/**',
  '/api/monsters/**',
  '/api/proficiencies/**',
  '/api/races/**',
  '/api/skills/**',
  '/api/spells/**',
  '/api/starting-equipment/**',
  '/api/subclasses/**',
  '/api/subraces/**',
  '/api/traits/**',
  '/api/weapon-properties/**',
];

const db = {
  uri: isDev ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
};

const webpack = {
  config: webpackConfig,
  dist: root('dist'),
  index: root('dist/index.html'),
  middleware: {
    options: {
      publicPath: webpackConfig.output.publicPath,
      contentBase: root('client/public'),
      noInfo: process.env.SILENCE_WEBPACK,
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    }
  },
};

const nodemon = {
  script: root('server/server'),
  ext: 'js, json',
  execMap: {
    js: 'node'
  },
  ignore: [],
  verbose: true,
  // Use legacy watch for file updates with env file modifier
  legacyWatch: process.env.LEGACY_WATCH ? true : false,
  watch: nodemonWatchList,
};

const api = {
  host: process.env.HOST_API || (process.env.HOST || '0.0.0.0'),
  port: process.env.PORT_API || 3005
};

module.exports = {
  isDev: isDev,
  root: root,
  db: db,
  website: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8080,
    email: {
      email: process.env.EMAIL,
      password: process.env.EMAIL_PASSWORD
    },
  },
  webpack: webpack,
  nodemon: nodemon,
  jwt: {
    secret: process.env.JWT_SECRET,
    options: { maxAge: 360000, httpOnly: false }
  },
  proxy: {
    api: {
      routes: apiRoutes,
      options: {
      target: "http://" + api.host + ':' + api.port,
      secure: false,
      changeOrigin: true
    },
    },
  },
};