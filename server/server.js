const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../secret.env'),
  debug: process.env.DEBUG
});

const express = require('./config/express.js');

const port = process.env.PORT || 8080;
const host = process.env.HOST || "0.0.0.0";

if (!process.env.NODE_ENV) {
    console.log(process.env.NODE_ENV)
    console.log("Node environment not found, using development by default.")
}

express.init().then(app => {
    app.listen(port, host, err => {
        if (err) {
            console.log(err);
        }
        console.info(">>> 🌎 Open http://%s:%s/ in your browser.", host, port);
    });
});
