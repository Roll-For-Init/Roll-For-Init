const router = require('express').Router();

router.use(function (req, res, next) {
    console.log('%s: %s', req.method, req.url)
    next()
})

router.use('/users', require('./users.js'));

router.use('/characters', require('./characters.js'));

router.all('/', (req, res) => {
    // TODO: Make better, possibly guess the correct route?
    res.status(404).send("Unknown api call.")
})

module.exports = router;
