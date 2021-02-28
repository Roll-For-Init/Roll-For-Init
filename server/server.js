const config = require('../config/config');

const express = require('./express.js');

module.exports = express.init().then(app => {
    let {host, port} = config.website;
    app.listen(port, host, err => {
        if (err) {
            console.log(err);
        }
        console.info(">>> 🌎 Open http://%s:%s/ in your browser.", host, port);
    });
});