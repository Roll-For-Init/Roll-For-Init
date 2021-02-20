const router = require('express').Router();
const { authenticateUser } = require("./middleware/userAuthMiddleware");

router.use(function (req, res, next) {
    console.log('%s: %s', req.method, req.url)
    next()
});

router.use('/users', require('./users.js'));

// Auth required to access API beyond designated routes in /users above
router.use(authenticateUser);

router.use('/characters', require('./characters.js'));

module.exports = router;
