const express = require('express'),
    mongoose = require('mongoose'),
    historyApiFallback = require("connect-history-api-fallback"),
    // cors = require('cors'),
    config = require("./config"),
    webpack = require("webpack"),
    helpers = require("../../webpack/helpers"),
    webpackHotMiddleware = require("webpack-hot-middleware"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackConfig = require("../../webpack.config");


module.exports.init = async() => {
    // Configuration
    const isDev = process.env.NODE_ENV !== "production";

    // Set up Mongoose
    const mongoDB = isDev ? config.db_dev : config.db;
    const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    };

    console.log('Attempting to connect to mongoose database.')
    await mongoose.connect(mongoDB, mongoOptions).then(() => {
        console.log('Successfully connected to mongoose database.')
    }, (error) => {
        console.log('MongoDB Connection Error:', error)
    });

    // Set up express
    const app = express();
    // app.use(cors())
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Middleware
    app.use(require('cookie-parser')());

    // app.use((req, res, next) => {
    //     res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
    //     res.header(
    //       "Access-Control-Allow-Headers",
    //       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    //     );
    //     if (req.method === 'OPTIONS') {
    //         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    //         return res.status(200).json({});
    //     }
    //     next();
    //   });

    // API Routing
    app.use('/api/v1/', require('../routes'));

    // Serve static files
    if (isDev) {
        app.use(
            historyApiFallback({
                verbose: false
            })
        );
        const compiler = webpack(webpackConfig);
        app.use(
            webpackDevMiddleware(compiler, {
                publicPath: webpackConfig.output.publicPath,
                contentBase: helpers.root('client/public'),
                noInfo: process.env.SILENCE_WEBPACK,
                stats: {
                    colors: true,
                    hash: false,
                    timings: true,
                    chunks: false,
                    chunkModules: false,
                    modules: false
                }
            })
        );
        app.use(webpackHotMiddleware(compiler));
        app.use(express.static(helpers.root('dist')));
    } else {
        app.use(express.static(helpers.root('dist')));

        app.get("*", function (req, res) {
            res.sendFile(helpers.root('dist/index.html'));
            res.end();
        });
    }

    return app
}
