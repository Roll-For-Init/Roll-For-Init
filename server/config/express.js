const express = require('express'),
    mongoose = require('mongoose'),
    historyApiFallback = require("connect-history-api-fallback"),
    config = require("./config"),
    webpack = require("webpack"),
    helpers = require("../../webpack/helpers"),
    webpackHotMiddleware = require("webpack-hot-middleware"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackConfig = require("../../webpack.config");


module.exports.init = async() => {
    // Set up Mongoose
    const mongoDB = config.db;
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

    const app = express();
    // app.use(cors())
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Own middleware
    app.use(require('cookie-parser')());

    // API Routing
    app.use('/api/v1/', require('../routes'));

    // Serve static files
    if (config.isDev) {
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
