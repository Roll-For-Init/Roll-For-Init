const router = require("express").Router();
const { authenticateUser, validateLoginForm, validateRegistrationForm } = require("./middleware/userAuthMiddleware");
const user_controller = require('../controllers/user.controller')

//  @route POST /users/register
//  @desc Register user
//  @access Public
router.post("/register", (req, res, next) => { //will probably want some kind of sanitizer for user input
  console.log(req.body);
  const error = new Error('');
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            error.message = 'Email';
            return res.status(401).send(error); //handle this on the frontend--but how?
        }
    });
    User.findOne({ username: req.body.username }).then((user) => {
        if (user) {
            error.message = error.message + ', Username';
            return res.status(401).send(error);
        }
    });

    bcrypt.hash(req.body.password, 10, (error, hash) => {
      if (error) return res.status(500).send('hashing error');
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      //TODO: Write this function
      // sendAuthenticationEmail(req, user);
      User.create(user, (err, post) => {
        if (err) return next(err);
        return res.status(200).json(post);
      });
    })
});

// @route POST /users/login
// @desc Login user 
// @access Public
router.post("/login", validateLoginForm, user_controller.login_user);

// Require user to be logged in to access the below routes
router.use(authenticateUser);

// @route POST /users/logout
// @desc Login user 
// @access Public
router.post("/logout", user_controller.logout_user)

//  @route GET /users/
//  @desc Return user list, may pass url query
//  @access Private
// TODO: Restrict to admin
router.get('/', user_controller.user_list);

//  @route GET /users/:username
//  @desc Return user
//  @access Public
router.get("/:username", user_controller.user_detail);

//  @route PUT /users/:username
//  @desc Update user
//  @access Public
router.put("/:username", user_controller.update_user);

//  @route DELETE /users/:username
//  @desc Delete user
//  @access Public
router.delete("/:username", user_controller.delete_user);

module.exports = router;
